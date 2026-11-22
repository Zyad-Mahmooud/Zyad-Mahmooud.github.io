// استيراد مكتبة JSZip لتكون متاحة داخل الـ Service Worker
importScripts('/lib/scripts/jszip.min.js');

const ZIPS_CACHE = 'zip-endpoints-cache-v1';
const DB_NAME = 'PluginsRegistryDB';
const DB_VERSION = 1;
const STORE_NAME = 'installed_plugins';

// ───────────── إدارة IndexedDB (قاعدة البيانات المحلية) ─────────────

function openDatabase() {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, DB_VERSION);
    
    request.onerror = () => reject(request.error);
    request.onsuccess = () => resolve(request.result);
    
    request.onupgradeneeded = (event) => {
      const db = event.target.result;
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        // نستخدم endpointPrefix كـ keyPath لضمان عدم تكرار الإضافة
        db.createObjectStore(STORE_NAME, { keyPath: 'endpointPrefix' });
      }
    };
  });
}

async function savePluginMetadata(pluginData) {
  const db = await openDatabase();
  return new Promise((resolve, reject) => {
    const transaction = db.transaction(STORE_NAME, 'readwrite');
    const store = transaction.objectStore(STORE_NAME);
    store.put(pluginData);
    transaction.oncomplete = () => resolve();
    transaction.onerror = () => reject(transaction.error);
  });
}

async function removePluginMetadata(endpointPrefix) {
  const db = await openDatabase();
  return new Promise((resolve, reject) => {
    const transaction = db.transaction(STORE_NAME, 'readwrite');
    const store = transaction.objectStore(STORE_NAME);
    store.delete(endpointPrefix);
    transaction.oncomplete = () => resolve();
    transaction.onerror = () => reject(transaction.error);
  });
}

async function getAllPlugins() {
  const db = await openDatabase();
  return new Promise((resolve, reject) => {
    const transaction = db.transaction(STORE_NAME, 'readonly');
    const store = transaction.objectStore(STORE_NAME);
    const request = store.getAll();
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
}

// ───────────── دورة حياة الـ SW ─────────────

self.addEventListener('install', () => self.skipWaiting());

self.addEventListener('activate', (event) => {
  event.waitUntil((async () => {
    const names = await caches.keys();
    await Promise.all(
      names
        .filter((n) => n.startsWith('zip-endpoints-cache-') && n !== ZIPS_CACHE)
        .map((n) => caches.delete(n))
    );
    await self.clients.claim();
  })());
});

// ───────────── استقبال الرسائل من الصفحة ─────────────

self.addEventListener('message', (event) => {
  const { type } = event.data || {};

  if (type === 'LOAD_ZIP') {
    event.waitUntil(loadZip(event));
  } else if (type === 'DELETE_ZIP') {
    event.waitUntil(deleteZip(event));
  } else if (type === 'LIST_PLUGINS') {
    event.waitUntil(listPlugins(event));
  }
});

function reply(event, message) {
  if (event.source) event.source.postMessage(message);
}

// ───────────── فك الـ ZIP وتخزين الملفات والبيانات ─────────────

async function loadZip(event) {
  const { zipFile, endpointPrefix } = event.data;

  try {
    const arrayBuffer = await zipFile.arrayBuffer();
    const zip = await JSZip().loadAsync(arrayBuffer);

    // التأكد من وجود ملف الـ manifest
    const manifestFile = zip.files['manifest.json'];
    if (!manifestFile) {
      reply(event, { type: 'ZIP_LOADED_ERROR', error: 'invalid Plugin !' });
      return;
    }

    // قراءة محتوى manifest.json لاستخلاص بيانات الإضافة (الاسم، الوصف، إلخ)
    const manifestContent = await manifestFile.async('text');
    let manifestData = {};
    try {
      manifestData = JSON.parse(manifestContent);
    } catch (e) {
      manifestData = { name: endpointPrefix };
    }

    const cache = await caches.open(ZIPS_CACHE);
    const jobs = [];

    zip.forEach((relativePath, zipEntry) => {
      if (zipEntry.dir) return;

      jobs.push((async () => {
        const content = await zipEntry.async('arraybuffer');
        const cleanPath = relativePath.replace(/^\//, '');
        const endpointUrl = new URL(
          endpointPrefix + cleanPath,
          self.location.origin
        ).toString();

        await cache.put(
          endpointUrl,
          new Response(content, {
            status: 200,
            headers: { 'Content-Type': getMimeType(relativePath) }
          })
        );
      })());
    });

    await Promise.all(jobs);

    // حفظ بيانات الإضافة في IndexedDB لضمان بقائها واسترجاعها بسرعة
    await savePluginMetadata({
      endpointPrefix,
      name: manifestData.name || endpointPrefix,
      version: manifestData.version || '1.0.0',
      description: manifestData.description || '',
      installedAt: new Date().toISOString()
    });

    reply(event, { type: 'ZIP_LOADED_SUCCESS', prefix: endpointPrefix });
    console.log('تم فك الـ ZIP وتخزين الملفات والبيانات بنجاح!');
  } catch (error) {
    console.error('خطأ أثناء معالجة ملف الـ ZIP:', error);
    reply(event, { type: 'ZIP_LOADED_ERROR', error: error.message });
  }
}

// ───────────── حذف endpoints مثبتة ─────────────

async function deleteZip(event) {
  const { endpointPrefix } = event.data;

  try {
    // التحقق من أن الـ endpointPrefix مرسل وصحيح تماماً
    if (!endpointPrefix) {
      throw new Error("endpointPrefix is missing or undefined");
    }

    const cache = await caches.open(ZIPS_CACHE);
    const prefixPath = new URL(endpointPrefix, self.location.origin).pathname;

    // 1. حذف الملفات من الـ Cache API
    for (const req of await cache.keys()) {
      if (new URL(req.url).pathname.startsWith(prefixPath)) {
        await cache.delete(req);
      }
    }

    // 2. حذف السجل من IndexedDB مع التأكد من إرسال القيمة الصحيحة
    await removePluginMetadata(endpointPrefix);

    reply(event, { type: 'ZIP_DELETED', prefix: endpointPrefix });
  } catch (error) {
    console.error("Delete Zip Error:", error.message);
    reply(event, { type: 'ZIP_DELETE_ERROR', error: error.message });
  }
}


// ───────────── جلب قائمة الإضافات المثبتة (أمر /list) ─────────────

async function listPlugins(event) {
  try {
    const plugins = await getAllPlugins();
    reply(event, { type: 'PLUGINS_LIST', plugins });
  } catch (error) {
    reply(event, { type: 'PLUGINS_LIST_ERROR', error: error.message });
  }
}

// ───────────── تقديم الملفات المخزنة ─────────────

self.addEventListener('fetch', (event) => {
  if (event.request.method !== 'GET') return;

  const url = new URL(event.request.url);
  if (url.origin !== self.location.origin) return;

  event.respondWith((async () => {
    const cache = await caches.open(ZIPS_CACHE);
    const hit = await cache.match(event.request, { ignoreSearch: true });
    return hit || fetch(event.request);
  })());
});

// ───────────── تحديد الـ Content-Type ─────────────

function getMimeType(filename) {
  const ext = filename.split('.').pop().toLowerCase();
  const types = {
    'html': 'text/html; charset=utf-8',
    'htm': 'text/html; charset=utf-8',
    'css': 'text/css; charset=utf-8',
    'js': 'application/javascript; charset=utf-8',
    'json': 'application/json; charset=utf-8',
    'png': 'image/png',
    'jpg': 'image/jpeg',
    'jpeg': 'image/jpeg',
    'gif': 'image/gif',
    'svg': 'image/svg+xml',
    'ico': 'image/x-icon',
    'woff': 'font/woff',
    'woff2': 'font/woff2',
    'ttf': 'font/ttf',
    'txt': 'text/plain; charset=utf-8'
  };
  return types[ext] || 'application/octet-stream';
}

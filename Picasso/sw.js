// استيراد مكتبة JSZip لتكون متاحة داخل الـ Service Worker
importScripts('/lib/scripts/jszip.min.js');

const LEGACY_CACHE_PREFIX = 'zip-endpoints-cache-';
const DB_NAME = 'PluginsRegistryDB';
const DB_VERSION = 2;
const PLUGINS_STORE = 'installed_plugins';
const FILES_STORE = 'plugin_files';

// ترويسات صارمة لمنع أي تخزين مؤقت من قبل المتصفح
const STRICT_NO_CACHE_HEADERS = {
  'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate, max-age=0',
  'Pragma': 'no-cache',
  'Expires': '0',
  'Surrogate-Control': 'no-store'
};

let dbPromise = null;

// ───────────── إدارة IndexedDB (قاعدة البيانات المحلية) ─────────────

function openDatabase() {
  if (dbPromise) {
    return dbPromise;
  }

  dbPromise = new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, DB_VERSION);

    request.onerror = () => {
      dbPromise = null;
      reject(request.error);
    };

    request.onsuccess = () => {
      const db = request.result;
      db.onclose = () => {
        dbPromise = null;
      };
      db.onversionchange = () => {
        db.close();
        dbPromise = null;
      };
      resolve(db);
    };

    request.onupgradeneeded = (event) => {
      const db = event.target.result;

      if (!db.objectStoreNames.contains(PLUGINS_STORE)) {
        db.createObjectStore(PLUGINS_STORE, { keyPath: 'endpointPrefix' });
      }

      if (!db.objectStoreNames.contains(FILES_STORE)) {
        const filesStore = db.createObjectStore(FILES_STORE, { keyPath: 'pathname' });
        filesStore.createIndex('byPrefix', 'endpointPrefix', { unique: false });
      }
    };
  });

  return dbPromise;
}

function normalizePrefix(endpointPrefix) {
  const path = new URL(String(endpointPrefix), self.location.origin).pathname;
  return path.endsWith('/') ? path : `${path}/`;
}

function buildPathname(endpointPrefix, relativePath) {
  const normalizedPrefix = normalizePrefix(endpointPrefix);
  const cleanPath = String(relativePath).replace(/^\/+/, '');
  return new URL(normalizedPrefix + cleanPath, self.location.origin).pathname;
}

function generateCacheBustToken(version) {
  const rand = Math.random().toString(36).slice(2, 8);
  return `${version || '1.0.0'}-${Date.now().toString(36)}-${rand}`;
}

function clearFilesByPrefix(filesStore, endpointPrefix) {
  return new Promise((resolve, reject) => {
    const index = filesStore.index('byPrefix');
    const range = IDBKeyRange.only(endpointPrefix);
    const cursorReq = index.openKeyCursor(range);

    cursorReq.onsuccess = (e) => {
      const cursor = e.target.result;
      if (cursor) {
        filesStore.delete(cursor.primaryKey);
        cursor.continue();
      } else {
        resolve();
      }
    };

    cursorReq.onerror = () => reject(cursorReq.error);
  });
}

async function savePluginAndFiles(pluginData, fileRecords) {
  const db = await openDatabase();
  const normalizedPrefix = normalizePrefix(pluginData.endpointPrefix);
  const cacheBustToken = pluginData.cacheBustToken || generateCacheBustToken(pluginData.version);

  const normalizedPlugin = {
    ...pluginData,
    endpointPrefix: normalizedPrefix,
    cacheBustToken
  };

  return new Promise((resolve, reject) => {
    const transaction = db.transaction([PLUGINS_STORE, FILES_STORE], 'readwrite');
    const pluginsStore = transaction.objectStore(PLUGINS_STORE);
    const filesStore = transaction.objectStore(FILES_STORE);

    transaction.oncomplete = () => resolve(normalizedPlugin);
    transaction.onerror = () => reject(transaction.error);
    transaction.onabort = () => reject(transaction.error || new Error('Transaction aborted'));

    clearFilesByPrefix(filesStore, normalizedPrefix)
      .then(() => {
        pluginsStore.put(normalizedPlugin);
        for (const fileRecord of fileRecords) {
          filesStore.put({
            ...fileRecord,
            endpointPrefix: normalizedPrefix,
            version: normalizedPlugin.version,
            cacheBustToken
          });
        }
      })
      .catch((err) => {
        transaction.abort();
        reject(err);
      });
  });
}

async function removePluginAndFiles(endpointPrefix) {
  const db = await openDatabase();
  const normalizedPrefix = normalizePrefix(endpointPrefix);

  return new Promise((resolve, reject) => {
    const transaction = db.transaction([PLUGINS_STORE, FILES_STORE], 'readwrite');
    const pluginsStore = transaction.objectStore(PLUGINS_STORE);
    const filesStore = transaction.objectStore(FILES_STORE);

    transaction.oncomplete = () => resolve();
    transaction.onerror = () => reject(transaction.error);
    transaction.onabort = () => reject(transaction.error || new Error('Transaction aborted'));

    pluginsStore.delete(normalizedPrefix);

    clearFilesByPrefix(filesStore, normalizedPrefix).catch((err) => {
      transaction.abort();
      reject(err);
    });
  });
}

async function getAllPlugins() {
  const db = await openDatabase();
  return new Promise((resolve, reject) => {
    const transaction = db.transaction(PLUGINS_STORE, 'readonly');
    const store = transaction.objectStore(PLUGINS_STORE);
    const request = store.getAll();
    request.onsuccess = () => resolve(request.result || []);
    request.onerror = () => reject(request.error);
  });
}

async function getFileFromDB(pathname) {
  const db = await openDatabase();
  return new Promise((resolve, reject) => {
    const transaction = db.transaction(FILES_STORE, 'readonly');
    const store = transaction.objectStore(FILES_STORE);
    const request = store.get(pathname);
    request.onsuccess = () => resolve(request.result || null);
    request.onerror = () => reject(request.error);
  });
}

// ───────────── دورة حياة الـ SW ─────────────

self.addEventListener('install', () => {
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil((async () => {
    // إزالة أي caches قديمة إن وجدت لضمان الاعتماد الكامل على IndexedDB + Cache Busting
    if ('caches' in self) {
      const names = await caches.keys();
      await Promise.all(
        names
          .filter((n) => n.startsWith(LEGACY_CACHE_PREFIX))
          .map((n) => caches.delete(n))
      );
    }
    await openDatabase();
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
  if (event && event.source && typeof event.source.postMessage === 'function') {
    event.source.postMessage(message);
  }
}

// ───────────── استخراج manifest.json وتحديد الجذر ─────────────

function locateManifest(zip) {
  if (zip.files['manifest.json'] && !zip.files['manifest.json'].dir) {
    return { manifestEntry: zip.files['manifest.json'], rootFolder: '' };
  }

  const candidates = Object.keys(zip.files).filter((path) => {
    const entry = zip.files[path];
    if (!entry || entry.dir) return false;
    const parts = path.split('/').filter(Boolean);
    return parts.length === 2 && parts[1] === 'manifest.json';
  });

  if (candidates.length === 1) {
    const fullPath = candidates[0];
    const rootFolder = `${fullPath.split('/')[0]}/`;
    return { manifestEntry: zip.files[fullPath], rootFolder };
  }

  return { manifestEntry: null, rootFolder: '' };
}

// ───────────── فك الـ ZIP وتخزين الملفات والبيانات في IndexedDB ─────────────

async function loadZip(event) {
  const { zipFile, endpointPrefix } = event.data || {};

  try {
    if (!zipFile || !endpointPrefix) {
      throw new Error('zipFile or endpointPrefix is missing');
    }

    const normalizedPrefix = normalizePrefix(endpointPrefix);
    const arrayBuffer = await zipFile.arrayBuffer();
    const zip = await JSZip.loadAsync(arrayBuffer);

    const { manifestEntry, rootFolder } = locateManifest(zip);
    if (!manifestEntry) {
      reply(event, { type: 'ZIP_LOADED_ERROR', error: 'Invalid plugin: manifest.json not found' });
      return;
    }

    const manifestContent = await manifestEntry.async('text');
    let manifestData = {};
    try {
      manifestData = JSON.parse(manifestContent);
    } catch (_) {
      manifestData = { name: normalizedPrefix };
    }

    const version = manifestData.version || '1.0.0';
    const cacheBustToken = generateCacheBustToken(version);
    const jobs = [];
    const fileRecords = [];

    zip.forEach((relativePath, zipEntry) => {
      if (zipEntry.dir) return;

      const normalizedRelativePath =
        rootFolder && relativePath.startsWith(rootFolder)
          ? relativePath.slice(rootFolder.length)
          : relativePath;

      if (!normalizedRelativePath) return;

      jobs.push((async () => {
        const buffer = await zipEntry.async('arraybuffer');
        const pathname = buildPathname(normalizedPrefix, normalizedRelativePath);
        fileRecords.push({
          pathname,
          endpointPrefix: normalizedPrefix,
          mimeType: getMimeType(normalizedRelativePath),
          version,
          cacheBustToken,
          data: buffer
        });
      })());
    });

    await Promise.all(jobs);

    const savedPlugin = await savePluginAndFiles(
      {
        endpointPrefix: normalizedPrefix,
        name: manifestData.name || normalizedPrefix,
        version,
        description: manifestData.description || '',
        cacheBustToken,
        installedAt: new Date().toISOString()
      },
      fileRecords
    );

    reply(event, {
      type: 'ZIP_LOADED_SUCCESS',
      prefix: normalizedPrefix,
      cacheBustToken: savedPlugin.cacheBustToken,
      version: savedPlugin.version
    });
    console.log('تم فك الـ ZIP وتخزين الملفات والبيانات في IndexedDB مع Cache Busting بنجاح!');
  } catch (error) {
    console.error('خطأ أثناء معالجة ملف الـ ZIP:', error);
    reply(event, { type: 'ZIP_LOADED_ERROR', error: error.message || String(error) });
  }
}

// ───────────── حذف endpoints مثبتة من IndexedDB ─────────────

async function deleteZip(event) {
  const { endpointPrefix } = event.data || {};

  try {
    if (!endpointPrefix) {
      throw new Error('endpointPrefix is missing or undefined');
    }

    const normalizedPrefix = normalizePrefix(endpointPrefix);
    await removePluginAndFiles(normalizedPrefix);

    reply(event, { type: 'ZIP_DELETED', prefix: normalizedPrefix });
  } catch (error) {
    console.error('Delete Zip Error:', error.message);
    reply(event, { type: 'ZIP_DELETE_ERROR', error: error.message || String(error) });
  }
}

// ───────────── جلب قائمة الإضافات المثبتة (أمر /list) ─────────────

async function listPlugins(event) {
  try {
    const plugins = await getAllPlugins();
    reply(event, { type: 'PLUGINS_LIST', plugins });
  } catch (error) {
    reply(event, { type: 'PLUGINS_LIST_ERROR', error: error.message || String(error) });
  }
}

// ───────────── تقديم الملفات من IndexedDB + Cache Busting ─────────────

function buildPluginEndpointResponse(record) {
  const etag = `"${record.cacheBustToken || record.version || '1.0.0'}"`;
  return new Response(record.data, {
    status: 200,
    headers: {
      'Content-Type': record.mimeType,
      'ETag': etag,
      'X-Plugin-Cache-Bust': record.cacheBustToken || '',
      ...STRICT_NO_CACHE_HEADERS
    }
  });
}

function buildCacheBustedUrl(rawUrl) {
  const url = new URL(rawUrl);
  url.searchParams.set('_cb', `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 6)}`);
  return url.toString();
}

async function fetchWithoutBrowserCache(request) {
  const headers = new Headers(request.headers);
  headers.set('Cache-Control', 'no-store, no-cache, must-revalidate, max-age=0');
  headers.set('Pragma', 'no-cache');
  headers.set('Expires', '0');

  if (request.method === 'GET') {
    const bustedUrl = buildCacheBustedUrl(request.url);
    const init = {
      method: 'GET',
      headers,
      credentials: request.credentials,
      redirect: request.redirect,
      referrer: request.referrer,
      referrerPolicy: request.referrerPolicy,
      integrity: request.integrity,
      cache: 'no-store'
    };

    if (request.mode !== 'navigate') {
      init.mode = request.mode;
    }

    return fetch(bustedUrl, init);
  }

  return fetch(request, { cache: 'no-store' });
}

self.addEventListener('fetch', (event) => {
  const request = event.request;

  if (request.method !== 'GET') {
    event.respondWith(fetchWithoutBrowserCache(request));
    return;
  }

  const url = new URL(request.url);
  if (url.origin !== self.location.origin) {
    event.respondWith(fetchWithoutBrowserCache(request));
    return;
  }

  event.respondWith((async () => {
    try {
      // مطابقة المسار الأساسي في IndexedDB مع تجاهل معاملات query string الخاصة بالـ cache busting
      const record = await getFileFromDB(url.pathname);
      if (record) {
        return buildPluginEndpointResponse(record);
      }
    } catch (err) {
      console.error('خطأ أثناء قراءة الملف من IndexedDB:', err);
    }

    // إذا لم يكن المسار ضمن endpoints الإضافات في IndexedDB، يتم جلبه مع كسر الكاش
    return fetchWithoutBrowserCache(request);
  })());
});

// ───────────── تحديد الـ Content-Type ─────────────

function getMimeType(filename) {
  const baseName = String(filename).split('/').pop() || '';
  const dotIndex = baseName.lastIndexOf('.');
  const ext = dotIndex > 0 ? baseName.slice(dotIndex + 1).toLowerCase() : '';

  const types = {
    'html': 'text/html; charset=utf-8',
    'htm': 'text/html; charset=utf-8',
    'css': 'text/css; charset=utf-8',
    'js': 'application/javascript; charset=utf-8',
    'mjs': 'application/javascript; charset=utf-8',
    'json': 'application/json; charset=utf-8',
    'png': 'image/png',
    'jpg': 'image/jpeg',
    'jpeg': 'image/jpeg',
    'webp': 'image/webp',
    'gif': 'image/gif',
    'svg': 'image/svg+xml',
    'ico': 'image/x-icon',
    'woff': 'font/woff',
    'woff2': 'font/woff2',
    'ttf': 'font/ttf',
    'txt': 'text/plain; charset=utf-8',
    'wasm': 'application/wasm'
  };

  return types[ext] || 'application/octet-stream';
}

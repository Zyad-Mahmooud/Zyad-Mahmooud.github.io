function initEntrypoint(el) {
  window.Entrypoint = el.contentWindow;
}
function setViewport(el) {
  document.getElementById("Preview").style[el.getAttribute("placeholder")] = el.value ? el.value+"px" : "";
}
function deleteNode(el) {
  var target = el.parentElement.node;
  Entrypoint.FBallTarget = target;
  Entrypoint.actions.del(target);
}
function renderDOMCard(el) {
  const NodeCard = render(`<div class="Node" draggable="true" node-id="${el.getAttribute("node-id")}">
<input type="checkbox" onchange="joinOrLeave(this)" ${targets.some(part => el.matches(part.selectorText)) ? "checked" : ""}><b>${el.localName}:${el.getAttribute("node-id")}</b>
<svg onclick="deleteNode(this)" xmlns="http://www.w3.org/2000/svg" version="1.1" viewBox="-5.0 -10.0 110.0 135.0">
 <path d="m29.125 44.793h-4.207l2.332 36.25c0.20703 3.582 3.207 6.375 6.793 6.375h31.918c3.582 0 6.582-2.793 6.793-6.375l2.332-36.25zm28.168 7.2891c0.042969-1.168 0.95703-2.082 2.168-2 1.168 0.042969 2.043 1.043 2 2.168l-1.082 22.332c-0.042968 1.082-0.95703 1.957-2.082 1.957h-0.082031c-1.168-0.042968-2.043-1.043-2-2.168zm-16.75-2c1.332-0.125 2.125 0.83203 2.168 2l1.082 22.293c0.042969 1.125-0.83203 2.125-2 2.168h-0.082031c-1.125 0-2.043-0.875-2.082-1.957l-1.082-22.332c-0.046875-1.1289 0.82812-2.1289 1.9961-2.1719z"/>
 <path d="m70.918 22.957h-5.207v-4.168l-0.003907-0.20703c0-3.332-2.707-6-6-6h-19.414c-3.293 0-6 2.668-6 6v4.375h-5.2109c-4.75 0-8.625 3.875-8.625 8.625v4.793c0 2.332 1.875 4.207 4.207 4.25h50.668c2.332-0.042969 4.207-1.918 4.207-4.25l0.003907-4.793c0-4.75-3.875-8.625-8.625-8.625zm-32.461-4.1641v-0.21094c0-1 0.83203-1.832 1.832-1.832h19.418c1 0 1.832 0.83203 1.832 1.832v4.375h-23.082z"/></svg> 
</div>`);
       NodeCard.node = el;
       NodeCard.cssom = Entrypoint.cssomOf(el);
    NodeCard.addEventListener("click",(e)=>{
         if(typeof programs[NodeCard.node.localName] == "function") {
           programs[NodeCard.node.localName](el);
         }
         window.Objects.targetRule = createStyleProxy(NodeCard.cssom);
         window.Objects.targetElement = new Proxy(NodeCard.node,{
        get: (t,p) => {
          return t[p];
        },
        set: (t,p,v) => {
          const oldValue = v;
          Notification({
                target: t,
                prop: p,
                value: v,
                oldValue,
                trigger: "property",
                type: "DOM"
              });
          t[p] = v;
          return v;
          }
        });
        console.log("ref updated");
       });
       if(!Array.from(document.querySelectorAll(".Nodes .Node")).some(Card => Card.node == el)) {
          document.querySelector(".Nodes").appendChild(NodeCard);
        }
}

function switchView() {
  var w = document.querySelector('.viewport [placeholder="width"]');
  var h = document.querySelector('.viewport [placeholder="height"]');
  var currentWidth = w.value;
  var currentHeight = h.value;
  w.value = h.value;
  h.value = currentWidth;
  h.dispatchEvent(new Event("input"));
  w.dispatchEvent(new Event("input"));
}
function changeDisplayedItemsList(n) {
  var table = [
    document.querySelector("#items"),
    document.querySelector("#Components"),
    ];
  table[Number(n)].style.display = "flex";
  table[Number(n) ? 0 : 1].style.display = "none";
}
function closeItemsList() {
  var itemsList = document.querySelector("#items-list");
  itemsList.style.display == "flex" ? itemsList.style.display = "none" : itemsList.style.display = "flex";
  itemsList.style.display == "flex" ? itemsList.style.visibility = "visible" : itemsList.style.visibility = "hidden";
}

window.addEventListener("load",()=>{
const toggleItemsPanel = document.querySelector(".toggle-items-panels");
const arr = [
  document.querySelector("#items-list #items"),
  document.querySelector("#items-list #Components")
  ];
toggleItemsPanel.addEventListener("pointerdown",()=>{
  toggleItemsPanel.value == "0" ? toggleItemsPanel.value = "1" : toggleItemsPanel.value = "0";
  const item = arr[Number(toggleItemsPanel.value)];
  arr.forEach((com)=>{
    if(com) {
      com.style.display = "none";
    }
  });
  item.style.display = "flex";
});
document.querySelector("#items").addEventListener("dragstart",(e)=>{
  window.dragged = e.target.cloneNode(true);
  setTimeout(function() {
    document.querySelector("#items-list").style.display = "none";
  }, 400);
  Entrypoint.frameElement.focus();
});
document.querySelector("#Components").addEventListener("dragstart",(e)=>{
  window.dragged = e.target.cloneNode(true);
  setTimeout(function() {
    document.querySelector("#items-list").style.display = "none";
  }, 400);
  Entrypoint.frameElement.focus();
});
const CSSEditor = document.querySelector("#css-editor");
let startX, startY, originX = 0, originY = 0, x = 0, y = 0, raf = null;
let w, h;

CSSEditor.style.touchAction = "none"; // يمنع تدخل المتصفح بالتمرير
CSSEditor.style.willChange = "transform";

CSSEditor.addEventListener("touchstart", e => {
  e.stopPropagation();
    const t = e.touches[0];
    const r = CSSEditor.getBoundingClientRect();
    w = r.width; h = r.height;
    startX = t.clientX - x;
    startY = t.clientY - y;
    originX = r.left - x; // موضع العنصر بدون الـ transform
    originY = r.top - y;
}, { passive: true });

CSSEditor.addEventListener("touchmove", e => {
    e.preventDefault();
    e.stopPropagation();
    const t = e.touches[0];

    x = t.clientX - startX;
    y = t.clientY - startY;

    // القيود
    

    if (!raf) raf = requestAnimationFrame(() => {
        CSSEditor.style.transform = `translate(${x}px, ${y}px)`;
        raf = null;
    });
}, { passive: false });
if(typeof onChange == "function") {
  onChange((e)=>{
    if(e.type == "DOM") {
      Entrypoint.document.querySelectorAll("body *:not([data-function])").forEach((el)=>{
    if(el && el.getAttribute("node-id")) {
      renderDOMCard(el);
    }
  });
    var dead = [...window.parent.document.querySelectorAll(".Nodes .Node")].filter(n => !n.node.isConnected);
    if(dead.length >= 1) {
      for (body of dead) {
        if(body) {
          body.parentElement.removeChild(body);
        }
      }
    }
    }
  });
}
window.parent.document.querySelector(".Nodes").addEventListener("click",(click)=>{
  if(click.target.matches(".Node")) {
    click.target.node.classList.add('Picasso-Targeting-highlight');
    setTimeout(function() {
      click.target.node.classList.remove('Picasso-Targeting-highlight');
    }, 800);
    var old = {...window.Objects};
    window.parent.Objects.targetElement = new Proxy(old.targetElement,{
        get: (t,p) => {
          return t[p];
        },
        set: (t,p,v) => {
          try {
            var oldValue = t[p];
              Entrypoint.Notification({
                target: t,
                prop: p,
                value: v,
                oldValue,
                trigger: "property",
                type: "DOM"
              });
          t[p] = v;
          } catch (e) {
            alert("DOM Error"+e);
          }
        }
      });
    window.parent.Objects.targetRule = new Proxy(old.targetRule,{
        get: (t,p) => {
          return t[p];
        },
        set: (t,p,v) => {
          try {
            var oldValue = t[p];
              Entrypoint.Notification({
                type: "CSSOM",
                trigger: window.Objects.trigger,
                rule: t.parentRule,
                prop: p,
                value: v,
                oldValue,
                isManuallySelected: true
              });
          t[p] = v;
          } catch (e) {
            alert("DOM Error"+e);
          }
        }
      });
  }
});
});
window.addEventListener("dragover", (e) => {
    e.preventDefault();
});
function openDOMEditor() {
  const el = document.querySelector("#DOMPatcher");
  el.style.display != "flex" ? el.style.display = "flex" : el.style.display = "none";
}

function toggleCSSEditor() {
  document.querySelector("#css-editor").style.display != "flex" ? document.querySelector("#css-editor").style.display = "flex" : document.querySelector("#css-editor").style.display = "none";
}

function setTrans(val) {
  document.querySelector("#css-editor").style.opacity = `0.${val}`;
}
function render(txt) {
  var p = document.createElement("div");
  p.innerHTML = txt;
  return p.firstChild;
}
function toggleDOMTree() {
  var Tree = document.querySelector("#DOM-Tree");
  Tree.style.display != "flex" ? Tree.style.display = "flex" : Tree.style.display = "none";
  window.parent.document.querySelector(".Nodes").innerHTML = "";
  Entrypoint.document.querySelectorAll("body *:not([data-function])").forEach((el)=>{
    if(el && el.getAttribute("node-id")) {
      renderDOMCard(el);
    }
  });
}
var targets = [];
var oldTargetRule = undefined;
function joinOrLeave(el) {
  if(el.checked) {
    targets.push(el.parentElement.cssom[0].rule);
  } else {
    var i = targets.indexOf(el.parentElement.cssom[0].rule);
    delete targets[i];
  }
if(targets.length >= 1) {
    oldTargetRule = window.Objects.targetRule;
    window.Objects.targetRule = new Proxy({
      isMultiTargetProxy: "Yup 👍"
    },{
      get:(t,p)=>{
        return t[p];
      },
      set:(t,p,v)=>{
        t[p] = v;
        for (target of targets) {
          if(target) {
          const oldValue = target.style[p];
            target.style[p] = v;
            Entrypoint.Notification(new HistoryNode({
              type: "CSSOM",
              source: "Multi-Element",
              trigger: window.Objects.trigger,
              rule: target,
              prop: p,
              value: v,
              oldValue,
              event: Objects.event,
              propType: CSSEditor.CSSProps[p].type
            }));
           if(window.Objects.trigger != "whileChange" && window.parent.CSSEditor.CSSProps[p] && window.parent.CSSEditor.CSSProps[p].type != "range") {
            Picasso.history.Stack.push(new HistoryNode({
              type: "CSSOM",
              trigger: window.Objects.trigger,
              rule: target,
              oldValue,
              value: v,
              prop: p,
              event: window.parent.Objects.event,
              isAddedByMe: true
            }));
            }
          }
        }
        
      }
    });
    console.log("Multiple Targeting: middlewear has been activated");
  } else {
    Entrypoint.dispatchEvent(new Event("click",{
      clinetX: 0,
      clinetY: 0,
      pageY: 0,
      pageX: 0,
      screenX: 0,
      screenY: 0,
      x: 0,
      y: 0,
    }));
  }
}
function Export() {
  function toJSX(code) {
  var parser = new DOMParser();
  var page = parser.parseFromString(code, "text/html");
  const attributeMap = {
    'class': 'className',
    'for': 'htmlFor',
    'tabindex': 'tabIndex',
    'readonly': 'readOnly',
  };
  const selectors = Object.keys(attributeMap).map(attr => `[${attr}]`).join(',');
  
  if (selectors) {
    const list = page.querySelectorAll(selectors);
    
    for (const item of list) {
      for (const [oldAttr, newAttr] of Object.entries(attributeMap)) {
        if (item.hasAttribute(oldAttr)) {
          item.setAttribute(newAttr, item.getAttribute(oldAttr));
          item.removeAttribute(oldAttr);
        }
      }
    }
  }
  
  return page.documentElement.outerHTML;
}

  const tempSheet = Paint.createSheet(Paint.exportSheet(Entrypoint.sheetX));
  Paint.minify(tempSheet,{
    SupportsOnly: ["color","font-family","background-image"],
    ignoreProps: ["--rule-id","grid-template-areas","grid-area","display"]
  });
  const CSSCode = Paint.exportSheet(tempSheet);
  var DOM = new DOMParser().parseFromString(Entrypoint.document.body.outerHTML,"text/html");
  [...DOM.querySelectorAll("[data-function],#picasso-ball-styles")].some(el => el.remove());
  const archive = new JSZip();
  archive.file("index.html",`<!DOCTYPE html>
<html lang="en-us">
  <head>
    <meta http-equiv="content-type" content="text/html; charset=utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0, viewport-fit=cover" />
    <link rel="stylesheet" href="app.css">
    <meta name="charset" content="utf-8" />
    <title>built with ♥️ by Picasso</title>
  </head>
  ${DOM.body.outerHTML}
</html>`);
  archive.file("Component.jsx",`
  import "./app.css";
  function MyComponent() {
    return (
    ${toJSX(DOM.body.outerHTML)}
    );
  }
  export default MyComponent;
  `);
  archive.file("app.css",Entrypoint.returnCSS());
  archive.file("Express.js",`
  const express = require('express');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;
const publicDirectoryPath = path.join(__dirname, 'public');

app.use(express.static(publicDirectoryPath));

app.listen(PORT, () => {
    console.log("You're Online, now you can visit http://localhost:"+PORT+" and preview your website !");
});
`);
  archive.file("package.json",`{
  "name": "express-static-server",
  "version": "1.0.0",
  "description": "خادم ويب محلي باستخدام Express.js لتقديم الملفات الثابتة",
  "main": "server.js",
  "scripts": {
    "start": "node Express.js"
  },
  "dependencies": {
    "express": "^4.19.2"
  },
  "keywords": [
    "express",
    "static-server",
    "web-server"
  ],
  "author": "",
  "license": "ISC"
}
`);
    archive.file("run.sh",`
  npm install && npm start
  `);
  archive.generateAsync({type: "blob"}).then(function(data){
    const downloadLink = URL.createObjectURL(data);
    var a = document.createElement("a");
    a.href = downloadLink;
    a.download = `Picasso website ${Date.now()}.zip`;
    a.click();
  });
}
function StartRemotion() {
  const MG = document.getElementById("Motion-Graphics");
  MG.style.display = getComputedStyle(MG).display != "flex" ? "flex" : "none";
}
var pastVal = NaN;

function NavigateInHistory(val) {
  // التصحيح: إزالة document.querySelector() الفارغة واستخدام val مباشرة
  var currentVal = Number(val);

  // 1. المقارنة بالقيمة القديمة لـ pastVal قبل تحديثها
  var method = currentVal > pastVal ? "redo" : "undo";

  // 2. تحديث الـ index والقيمة السابقة
  Picasso.history.index = currentVal;
  pastVal = currentVal; 

  Picasso.history.method = method;

  // 3. تنفيذ الدالة المناسبة بناءً على الـ method
  if (method === "redo") {
    Picasso.history.redo.apply(Picasso.history);
  } else {
    Picasso.history.undo.apply(Picasso.history);
  }
}

function DesignToVideo() {
  var MGT = document.getElementById("Motion-Graphics-timeline");
  if(document.getElementById("autoback").checked) {
    document.getElementById("Motion-Graphics").style.display = "none";
  }
  var stepsPerSecInput = document.getElementById("steps-per-sec");
  var availableLengthSpan = document.getElementById("available-length");
  var subtitles = document.querySelector("#subtitles p");
  subtitles.parentElement.style.display = "flex";
  if (Picasso.history.Stack) {
    availableLengthSpan.textContent = Picasso.history.Stack.length;
    if (MGT) {
      MGT.max = Picasso.history.Stack.length - 1;
    }
  }

  var stepsPerSec = Number(stepsPerSecInput.value) || 1;
  var intervalTime = 1000 / stepsPerSec;

  // 1. إعادة تعيين المؤشر للبداية (فوري بدون حلقة معقدة تعطل الـ UI)
  while(Picasso.history.index > 0) {
    Picasso.history.undo.call(Picasso.history);
  }

  // 2. البدء بعرض الخطوات (Redo) تدريجياً مع تحديث الشرح والـ Subtitles بانتظام
  const interval = setInterval(() => {
    if (Picasso.history.index >= Picasso.history.Stack.length - 1) {
      clearInterval(interval);
      if (subtitles) subtitles.innerText = "Thanks to watching 💪🔥";
      setTimeout(function() {
        subtitles.parentElement.style.display = "none";
        StartRemotion();
      }, 4000);
      return;
    }

    // تنفيذ الـ Redo للخطوة الحالية
    Picasso.history.redo.call(Picasso.history);
    
    // تحديث الـ Timeline والـ UI
    if (MGT) {
      MGT.value = Picasso.history.index;
    }
    availableLengthSpan.textContent = Picasso.history.Stack.length;

    // تحديث الـ Subtitles بذكاء بناءً على الحدث الحالي في الـ Stack
    if(Picasso.history && Picasso.history.current) {
      var currentItem = Picasso.history.current;
      
      if(currentItem.type == "CSSOM" && currentItem.prop) {
        // التأكد من مصدر الـ CSSProps الصحيح (إذا كانت عبر window أو CSSEditor المحلي)
        var cssPropsSource = window.CSSEditor?.CSSProps || window.parent?.CSSEditor?.CSSProps;
        var metadata = cssPropsSource?.[currentItem.prop];
        
        var groupName = metadata ? metadata.group : "***";
        var propName = currentItem.prop;
        var propVal = currentItem.value; // أو currentItem.rule.style[propName]

        if(subtitles) {
          subtitles.innerText = `Go to 🖌️ > ${groupName} > then select ${propName} then change it's value to ${propVal}`;
        }
      } else if(currentItem.type == "DOM") {
        if(subtitles) {
          subtitles.innerText = `Update DOM element property ${currentItem.prop} to ${currentItem.value}`;
        }
      }
    }

  }, intervalTime); 
}
function resetHighlight() {
  const oldOnes = Entrypoint.document.getElementsByClassName("Picasso-Targeting-highlight");
  for(oldOne of oldOnes) {
    if(oldOne) {
      oldOne.classList.remove("Picasso-Targeting-highlight");
    }
  }
}
window.addEventListener("drag",(e)=>{
  resetHighlight();
 const el = Entrypoint.document.elementFromPoint(
    Entrypoint.scrollX+e.x,
    Entrypoint.scrollY+e.y);
  el.classList.add("Picasso-Targeting-highlight");
});
window.addEventListener("dragend",()=>{
  resetHighlight();
});
function upload(file) {
  return URL.createObjectURL(file);
}
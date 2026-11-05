function newClasses(ref,parent) {
  if(!ref) return;
  return Paint.deepCloneNodeWithStyles(ref,parent);
}
function newClassesAppnd(parent,ref) {
  if(!ref) return;
  return newClasses(ref,parent);
}
function isExcluded(el) {
    return el.matches("[data-function]");
 }
function Notification(obj) {
  for (fun of window.parent.functionsList) {
      if(typeof fun == "function") {
        fun(obj);
      }
    }
}
window.addEventListener("load",()=>{
  window.place = window.parent.document.querySelector("#element-props");
  document.body.addEventListener("dragover", (e) => {
    e.preventDefault();
  });
  const app = function (e) {
    if(window.parent.document.querySelector(".items-container")) {
      window.parent.document.querySelector(".items-container").style.marginLeft = "900px";
    }
  };
document.body.addEventListener("drop", (e)=> {
  e.preventDefault();
  const Clone = window.parent.dragged.cloneNode(true);
  window.parent.dragged = undefined;
  Clone.removeAttribute("draggable");
  Clone.removeAttribute("draggable-item");
  if(Clone.hasAttribute("data-item")) {
    if(typeof window.parent.templates?.[Clone.getAttribute("data-item")] == "function") {
    window.parent.templates[Clone.getAttribute("data-item")](e.target,false);
    }
  } else {
  var newNode = newClasses(Clone,e.target);
    e.target.appendChild(newNode);
    Notification({
     type: "DOM",
     trigger: "addNode",
     target: e.target,
     addedNode: newNode,
     addedNodeCSSRules: Paint.getMatched(newNode,{
       ignore: [
       Paint.getSheetRoot("items.css"),
       Paint.getSheetRoot("Components.css"),
       Paint.getSheetRoot("defaults.css"),
       Paint.getSheetRoot("none.css"),
       Paint.getSheetRoot("reset.css"),
       ]
     }),
     CSSRules: Paint.getMatched(e.target,{
       ignore: [
       Paint.getSheetRoot("items.css"),
       Paint.getSheetRoot("Components.css"),
       Paint.getSheetRoot("defaults.css"),
       Paint.getSheetRoot("none.css"),
       Paint.getSheetRoot("reset.css"),
       ]
     })
    });
  }
  if(window.parent.document.querySelector(".items-container")) {
    window.parent.document.querySelector(".items-container").style.marginLeft =
    "900px";
  }
});
document.addEventListener("drop", (e)=>{
e.preventDefault();
});
window.addEventListener("mousedown", (e) => {
    if (e.target.type === "range") {
      setTimeout(() => {
        app(e);
      }, 10);
    } else {
      app(e);
    }
  });
window.addEventListener("click", (e) => {
    if (window.isExcluded(e.target)) {
    return;
  }
  if (e.target.type !== "range") {
    app(e);
  }
  let el = e.target;
  let tag = el.tagName.toLowerCase();
if (e.target.hasAttribute("data-function")) {
    return;
  }
  FBallTarget = e.target;
    window.parent.Objects.targetElement = new Proxy(e.target,{
        get: (t,p) => {
          return t[p];
        },
        set: (t,p,v) => {
          try {
            var oldValue = t[p];
              Notification({
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
  let shorthand;
  let this_props = {};

  if (tag != "input") {
    if (window.parent.Shorthands?.[tag]) {
      this_props = window.parent.Shorthands[tag].props;
    }
  } else {
    if (window.parent.Shorthands?.[tag]) {
      this_props = window.parent.Shorthands[tag][el.type]?.props;
    }
  }
  const computed = getComputedStyle(e.target);

  for (const [prop, value] of Object.entries(computed)) {
    if (!value) continue;

    const tagRef = window.parent.document
      .querySelector(".celement")
      ?.contentWindow?.document
      ?.querySelector(`*[prop="${prop}"]`);
    if (!tagRef) continue;

    if (tagRef.tagName === "SELECT") {
      const val = getComputedStyle(e.target)[prop];
      if (val !== "") {
        const exists = Array.from(tagRef.options).some(opt => opt.value === val);
        if (!exists) {
          const opt = document.createElement("option");
          opt.value = val;
          opt.textContent = val;
          tagRef.appendChild(opt);
        }
        tagRef.value = val;
      } else {
        tagRef.value = tagRef.options[0]?.value || "";
      }
      continue;
    }

    if (tagRef.classList.contains("ColorSelector")) {
      tagRef.style.backgroundColor = computed.backgroundColor;
      continue;
    }
  }
  const rangeParents = window.parent?.document?.querySelector(".celement")?.contentWindow?.document?.querySelectorAll('.range-settings');
  if (rangeParents) {
  const targetRule = window.parent.Objects?.targetRule;
  const targetElementParent = window.parent.Objects.targetElement?.parentNode;
const forbidden = ["height","width"]; // because of getComputedStyle returns values in pixels wich is not useful we'll ignore basic layout properties and add parental unit such as %/rem/em
  for (let i = 0; i < rangeParents.length; i++) {
    const parent = rangeParents[i];
    const container = parent.parentNode;
    if (container) {
      const rangeInput = container.querySelector('input[type="range"]');
      const prop = rangeInput?.getAttribute("prop");

      let QQR = targetRule[prop] || "0px";
      let numericValue = parseFloat(QQR) || 0;
      let unit = String(QQR).replace(numericValue, "") || "px";
      const computedMax = parseFloat(getComputedStyle(targetElementParent)[prop]) || 1000;
      const maxInput = container.querySelector('input[placeholder="max"]');
      if (maxInput && !forbidden.includes(prop)) maxInput.value = computedMax;
      
      if (rangeInput && !forbidden.includes(prop)) {
        rangeInput.max = computedMax;
        rangeInput.value = numericValue;
      }

      const unitSelect = container.querySelector('select');
      if (unitSelect && !forbidden.includes(prop)) {
        unitSelect.value = unit;
      }
    }
  }
}
  const colorSelectors = window?.parent?.document?.querySelector(".celement")?.contentWindow?.document?.querySelectorAll('.ColorSelector');
  if (colorSelectors) {
    for (let i = 0; i < colorSelectors.length; i++) {
      let ColorSelector = colorSelectors[i];
      ColorSelector.style.backgroundColor = computed[ColorSelector.getAttribute("prop")];
    }
  }
if (e.target.tagName == "HTML") {
    window.parent.Objects.targetElement = new Proxy(document.body,{
        get: (t,p) => {
          return t[p];
        },
        set: (t,p,v) => {
          try {
            Notification({
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
    window.parent.Objects.targetRule = Paint.getCSSObj(`.${document.body.classList[0]}`, {
      Create: true
    });
  }
});
  window.addEventListener("change", (e) => {
    if (e.target.type === "range") {
      app(e);
    }
  });
  window.addEventListener("touchstart", (e) => {
    if (e.target.type === "range") {
      setTimeout(() => {
        app(e);
      }, 50);
    }
  });
document.body.addEventListener("input",(e)=> {
    app(e);
    
  if((!e.target.hasAttribute("data-function") || (!window.parent.Shorthands?.[tag]))) {
    return;
  }
  window.parent.Objects.targetElement = new Proxy(e.target,{
        get: (t,p) => {
          return t[p];
        },
        set: (t,p,v) => {
          var oldValue = t[p];
              Notification({
                target: t,
                prop: p,
                value: v,
                oldValue,
                trigger: "property",
                type: "DOM"
              });
          t[p] = v;
          }
      });
    let el = e.target;
    let tag = el.tagName.toLowerCase();
    let shorthand;
    let this_props = {};
    if(tag != "input") {
    		let myProps = window.parent.Shorthands[tag]?.props;
    		if(myProps) {
    			this_props = myProps;
    		}
    	} else {
    		let tagProps = window.parent.Shorthands[tag][el.type]?.props;
    		if(tagProps) {
    			this_props = tagProps;
    		}
    	}
    let Inputtxt = "";
    if(place){
      place.innerHTML = "";
    }
    Object.keys(this_props).forEach((o)=>{
    	place.appendChild(returnDOM(`<label class="CSSPropTitle">${o}</label><input type="text" placeholder="${o}" oninput="setElementProps(this)" value="${el[o]}" class="prop-edit-box">`));
    });
   
  });
});
function returnDOM(html){
  const parser = new DOMParser();
  const page = parser.parseFromString(html, "text/html");
  const bodyChild = page.querySelector("body > *");
  return bodyChild;
}

function exportCSS() {
return Paint.exportSheet(window.sheetX);
}
function pushCSS(code) {
  Paint.updateSheet(sheetX,code);
  Paint.identity(sheetX);
}
function importRule(selector) {
return Paint.getCSSObj(selector,{Create: true});
}
function deleteRule(selector) {
  alert("start");
  window.FBallTarget = window.parent.Objects.targetElement;
  window.actions.del();
  alert("done");
}
function GarbageCollector() {
  console.log(`✨ Cleanup complete. Removed unused rules.`);
}
function makeItSmaller() {
  var temp = Paint.createSheet(Paint.exportSheet(sheetX));
  Paint.Clean(temp);
  Paint.minify(temp);
  sheetX.replaceSync(Paint.exportSheet(temp));
}
function exportSheet() {
   return Paint.exportSheet(window.sheetX);
}
function returnRoot() {
  return Paint.getCSSObj(":root").parentRule.cssText;
}
function returnSheet() {
  return CSSInsertEngine;
}
function returnBackupSheet() {
  return Paint.getSheet("items.css");
}
window.addEventListener("drop",(event)=>{
var W = document.querySelectorAll("#SVGContainer");
if(W.length > 0) {
  W.forEach((Q)=>{
Q.outerHTML = Q.innerHTML;
});
}
event.preventDefault();
});
window.returnBackupSheet = returnBackupSheet;
(function () {
  window.parent.functionsList = [];
  
  const onChange = (callback) => {
    if (!window.parent.functionsList.includes(callback)) window.parent.functionsList.push(callback);
  };
  window.onChange = onChange;
  window.parent.onChange = onChange;
  const main = function (e) {
    if (!e || !e.target || e.target.nodeType !== 1 || isExcluded(e.target)) return;
    function returnType(p) {
      if(window.parent.CSSEditor && window.parent.CSSEditor.CSSProps[p] && window.parent.CSSEditor.CSSProps[p].type) {
        return window.parent.CSSEditor.CSSProps[p].type;
      }
    }
    let matchedRules = Paint.getMatched(e.target,{
      ignore: [
       Paint.getSheetRoot("items.css"),
       Paint.getSheetRoot("Components.css"),
       Paint.getSheetRoot("defaults.css"),
       Paint.getSheetRoot("none.css"),
       Paint.getSheetRoot("reset.css"),
       ]
    });
    let stylesMap = { primary: null };
    window.createStyleProxy = function(obj) {
      if(obj) {
        return new Proxy(obj, {
      set: (t, p, v) => {
        Notification({
            type: 'CSSOM',
            target: e.target,
            cssRules: Paint.getMatched(e.target,{
      ignore: [
       Paint.getSheetRoot("items.css"),
       Paint.getSheetRoot("Components.css"),
       Paint.getSheetRoot("defaults.css"),
       Paint.getSheetRoot("none.css"),
       Paint.getSheetRoot("reset.css"),
       ]
    }),
            prop: p,
            value: v,
            oldValue: t[p],
            rule: t.parentRule,
            event: e,
            trigger: window.parent.Objects.trigger ? window.parent.Objects.trigger : "unknown",
            propType: returnType(p)
          });
        t[p] = v;
        return true;
      },
      get: (t, p) => t[p] 
    });
      }
    };
    window.parent.createStyleProxy = createStyleProxy;
    if (!matchedRules.length || !matchedRules[0].rule) {
        if(!e.target.classList.length) e.target.classList.add(`${e.target.tagName.toLowerCase()}-${Date.now()}`);
        stylesMap.primary = Paint.getCSSObj(`.${e.target.classList[0]}`, {Create: true});
    } else {
        stylesMap.primary = matchedRules[0].rule.style;
    }

    window.parent.Objects = {
      targetElement: new Proxy(e.target,{
        get: (t,p) => {
          return t[p];
        },
        set: (t,p,v) => {
          const oldValue = t[p];
          Notification({
                target: t,
                prop: p,
                value: v,
                oldValue,
                trigger: "property",
                type: "DOM"
              });
          t[p] = v;
          }
        }),
      targetRule: createStyleProxy(stylesMap.primary),
      cssRules: Paint.getMatched(e.target,{
      ignore: [
       Paint.getSheetRoot("items.css"),
       Paint.getSheetRoot("Components.css"),
       Paint.getSheetRoot("defaults.css"),
       Paint.getSheetRoot("none.css"),
       Paint.getSheetRoot("reset.css"),
       ]
    }),
      event: e.type
    };
  };
  var el = document.createElement("input");
var events = [];
for (key in el) {
  if(key.startsWith("on")) {
    events.push(key.replace("on",""))
  }
}
  events.forEach(evtType => {
    window.addEventListener(evtType, (ev) => {
  if (!ev || ev.target?.hasAttribute?.("data-function")) {
    return;
  }
  if (evtType === "drop") {
    setTimeout(() => {
      Notification({
        event:ev,
        type: ev.type
      });
    }, 10);
    
    return;
  }
  main(ev);
  Notification({
        event:ev,
        type: ev.type,
        cssRules: Paint.getMatched(ev.target,{
      ignore: [
       Paint.getSheetRoot("items.css"),
       Paint.getSheetRoot("Components.css"),
       Paint.getSheetRoot("defaults.css"),
       Paint.getSheetRoot("none.css"),
       Paint.getSheetRoot("reset.css"),
       ]
    })
      });
}, true);
  });
})();
function returnCSS() {
  return Paint.exportSheet(sheetX);
}
function returnHTML() {
var tempBody = new DOMParser().parseFromString(document.body.outerHTML,"text/html");
tempBody.querySelectorAll("[data-function],#PFB,c-toggler,c-console").forEach(function(df){
  df.remove();
});
tempBody.querySelectorAll(".Picasso-Targeting-highlight").forEach(function(el){
  el.classList.remove("Picasso-Targeting-highlight");
});
  return tempBody.body.outerHTML;
}
function cssomOf(el) {
  return Paint.getMatched(el,{
      ignore: [
       Paint.getSheetRoot("items.css"),
       Paint.getSheetRoot("Components.css"),
       Paint.getSheetRoot("defaults.css"),
       Paint.getSheetRoot("none.css"),
       Paint.getSheetRoot("reset.css"),
       ]
    });
}
function updateSelectionStyle(code) {
  Paint.getCSSObj(".Picasso-Targeting-highlight").cssText = code;
}
function Execute(val) { return eval(val); }

window.addEventListener("click",(e)=>{
if(!e.target.hasAttribute("data-function")) {
    var t = document.getElementsByClassName("Picasso-Targeting-highlight");
  for (_ of t) {
    _.classList.remove("Picasso-Targeting-highlight");
  }
  e.target.classList.add("Picasso-Targeting-highlight");
  setTimeout(function() {
      for (_ of t) {
    _.classList.remove("Picasso-Targeting-highlight");
  }
    }, 800);
  }
});
window.addEventListener("load", (e) => {
  onChange((event) => {
    if(event.type == "click") {
      var rule = event.cssRules[0].rule;
      var DOMCards = window.parent.document.querySelectorAll(".DOMCard");
      for(let DOMCard of DOMCards) {
        if(DOMCard.CSSOM == rule) {
           DOMCard.style.background = "var(--OrangeGradient)";
           DOMCard.style.backgroundClip = "text";
           DOMCard.style.color = "rgba(0,0,0,0)";
           setTimeout(function() {
             DOMCard.style.removeProperty("background");
             DOMCard.style.removeProperty("background-clip");
             DOMCard.style.removeProperty("color");
           }, 1000);
        }
      }
    }
  });
});
function FormErrorExplaination(event) {
  event.preventDefault();
  alert("You're trying to open "+ (event.target.action || event.target.href) + " but Picasso doesn't support navigation 🫤");
}
var BuildingHistory = [];
window.addEventListener("load",()=>{
  if(typeof onChange == "function") {
    // grid management
    onChange((e) => {
  if (e.type !== "DOM" && !(e.trigger === "addNode" || e.trigger === "paste")) {
    return;
}

  
  const parent = e.target;
  if(!parent || !parent instanceof HTMLElement) return;
  const style = getComputedStyle(parent);
  if (style.display === "grid" && style.gridTemplateAreas !== "none") {
    
    // 1. استخراج المناطق المتاحة (مرة واحدة فقط)
    const getNextAvailableArea = () => {
      const allAreas = String(style.gridTemplateAreas).replaceAll('"', "").split(/\s+/);
      const uniqueAreas = [...new Set(allAreas)].filter(a => a && a !== ".");
      
      return uniqueAreas.find(area => 
        ![...parent.children].some(child => getComputedStyle(child).gridArea === area)
      ) || null;
    };

    const targetArea = getNextAvailableArea();

    // 2. التحقق من النتيجة والتعامل معها
    if (targetArea) {
      e.addedNodeCSSRules[0].rule.style.gridArea = targetArea;
    } else {
      // لا توجد مساحة: تنبيه وحذف
      alert("😯 Grid is full!, keep in mind this operation isn't shown in the history");
      window.FBallTarget = e.addedNode;
      window.actions.del(e.addedNode);
    }
}

});
let isSyncing = false;

onChange((e) => {
    if (isSyncing || e.type !== "DOM" || e.trigger !== "addNode") return;

    const parent = e.target;
    const addedNode = e.addedNode;
    
    // بناء محدد (Selector) دقيق يشمل الـ tagName والـ type إذا وجد
    let selector = `:scope > ${addedNode.localName}`;
    if (addedNode.tagName === 'INPUT' && addedNode.type) {
        selector += `[type="${addedNode.type}"]`;
    }
    selector += `:not([data-function])`;

    const siblings = parent.querySelectorAll(selector);
    
    if (siblings.length >= 2) {
        isSyncing = true;
        
        const archetype = siblings[siblings.length - 2];
        const newNode = Paint.deepCloneNodeWithStyles(archetype);
       if(newNode.children.length >= 1) {
          newNode.children.forEach((e)=>{
          if(e) {
            newNode.removeChild(e);
          }
        });
        }
        newNode.removeAttribute('id');
        parent.replaceChild(newNode, addedNode);
        
        isSyncing = false;
    }
});



  }
});

window.addEventListener("load",()=>{
  Paint.updateSheet(window.sheetX,`
  html {
    padding: 0;
    margin: 0;
    --rule-id: xyz9966vwx;
  }
  body {
    padding: 0;
    margin: 0;
    --rule-id: e70fdcef70;
  }
  `);
});

function findRule(obj) {
  return Paint.findRule({
    sheet:sheetX,
    ...obj
  });
}
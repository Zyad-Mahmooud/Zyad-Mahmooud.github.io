(()=>{
// ================= GUARDS =================
let __inNotify = false;
let __inPicasso = false;
const PATCHED = Symbol("patched");

function safeGetMatchedRules(node){
  if(__inNotify || __inPicasso || !node) return undefined;
  if(typeof Paint==="undefined"||!Paint||typeof Paint.getMatched!=="function") return undefined;
  try{ return Paint.getMatched(node); }catch(_){ return undefined; }
}
function safeNotify(payload){
  if(__inNotify) return;
  if(typeof Notification!=="function") return;
  __inNotify = true;
  try{ Notification(payload); }catch(e){ console.error("[Notify Error]:",e,payload); }
  finally{ __inNotify = false; }
}
function raw(o){
  if(!o||typeof o!=="object") return o;
  return o._target||o.target||o.raw||o.element||o.el||o;
}
function getAction(name){
  if(typeof Picasso!=="undefined" && Picasso.actions && typeof Picasso.actions[name]==="function") return Picasso.actions[name];
  if(typeof window!=="undefined" && window.Picasso && window.Picasso.actions && typeof window.Picasso.actions[name]==="function") return window.Picasso.actions[name];
  return null;
}
// بينفذ Native وانت قافل Picasso عشان ميعملش Loop
function runNative(fn, thisArg, args){
  __inPicasso = true;
  try{ return fn.apply(thisArg, args); }
  finally{ __inPicasso = false; }
}
// بينفذ Picasso ولو رجع حاجة غلط بيرجع للـ Native
function runPicassoOrNative(actionName, picassoArgs, nativeFn, nativeThis, nativeArgs, validate){
  const act = getAction(actionName);
  if(!act) return runNative(nativeFn, nativeThis, nativeArgs);
  __inPicasso = true;
  try{
    const r = act.apply(nativeThis, picassoArgs);
    if(validate && !validate(r)){
      // Picasso مرجعش اللي متوقع منه، ارجع للـ Native
      return runNative(nativeFn, nativeThis, nativeArgs);
    }
    return r;
  }catch(_){
    return runNative(nativeFn, nativeThis, nativeArgs);
  }finally{ __inPicasso = false; }
}
function patch(proto, name, wrapper){
  if(!proto||typeof proto[name]!=="function") return;
  if(proto[name][PATCHED]) return;
  const original = proto[name];
  const fn = wrapper(original);
  fn[PATCHED] = true;
  proto[name] = fn;
}
function patchSetter(proto, prop, wrapper){
  const desc = Object.getOwnPropertyDescriptor(proto, prop);
  if(!desc||typeof desc.set!=="function") return;
  if(desc.set[PATCHED]) return;
  const originalSet = desc.set;
  const originalGet = desc.get;
  const newSet = function(v){ return wrapper.call(this, originalSet, v); };
  newSet[PATCHED] = true;
  Object.defineProperty(proto, prop, { configurable:true, enumerable:desc.enumerable, get:originalGet, set:newSet });
}

// ================= NATIVE BACKUP =================
const NodeProto = Node.prototype;
const ElementProto = Element.prototype;
const CharacterDataProto = CharacterData.prototype;

// ================= DOM: Node =================
patch(NodeProto, "appendChild", (original)=>function(child){
  if(__inPicasso || __inNotify) return original.call(this, child);
  const p = raw(this), c = raw(child);
  const prevParent = c?c.parentNode:null, prevNext = c?c.nextSibling:null;
  const isFrag = c&&c.nodeType===11;
  const added = isFrag?[...c.childNodes]:[c];
  const result = runPicassoOrNative("copy", [p,c], original, p, [c], r=>r&&r.nodeType);
  try{ safeNotify({type:"DOM",trigger:prevParent?"move":"ADD",subTrigger:"appendChild",parent:p,node:result,addedNodes:added,previousParent:prevParent,previousNextSibling:prevNext,addedNodeCSSRules:!isFrag?safeGetMatchedRules(result):[],cssRules:safeGetMatchedRules(p)}); }catch(_){}
  return result;
});
patch(NodeProto, "insertBefore", (original)=>function(child, ref){
  if(__inPicasso || __inNotify) return original.call(this, child, ref);
  const p = raw(this), c = raw(child), r = raw(ref);
  const prevParent = c?c.parentNode:null, prevNext = c?c.nextSibling:null;
  const isFrag = c&&c.nodeType===11;
  const added = isFrag?[...c.childNodes]:[c];
  const result = runPicassoOrNative("copy", [p,c,r], original, p, [c,r], x=>x&&x.nodeType);
  try{ safeNotify({type:"DOM",trigger:prevParent?"move":"ADD",subTrigger:"insertBefore",parent:p,node:result,addedNodes:added,referenceNode:r,previousParent:prevParent,previousNextSibling:prevNext,cssRules:safeGetMatchedRules(p)}); }catch(_){}
  return result;
});
patch(NodeProto, "removeChild", (original)=>function(child){
  if(__inPicasso || __inNotify) return original.call(this, child);
  const p = raw(this), c = raw(child);
  const prevNext = c?c.nextSibling:null;
  const result = runPicassoOrNative("del", [c], original, p, [c], x=>x&&x.nodeType) || c;
  try{ safeNotify({type:"DOM",trigger:"del",subTrigger:"removeChild",targetParent:p,node:result,previousNextSibling:prevNext,addedNodeCSSRules:safeGetMatchedRules(result),cssRules:safeGetMatchedRules(p)}); }catch(_){}
  return result;
});
patch(NodeProto, "replaceChild", (original)=>function(newChild, oldChild){
  if(__inPicasso || __inNotify) return original.call(this, newChild, oldChild);
  const p = raw(this), n = raw(newChild), o = raw(oldChild);
  const prevParent = n?n.parentNode:null, prevNext = o?o.nextSibling:null;
  // replace = del القديم + copy الجديد
  const result = runPicassoOrNative("replace", [p,n,o], original, p, [n,o], x=>x&&x.nodeType) || o;
  try{ safeNotify({type:"DOM",trigger:"replace",subTrigger:"replaceChild",parent:p,node:result,newNode:n,oldNode:o,previousParent:prevParent,previousNextSibling:prevNext,cssRules:safeGetMatchedRules(p)}); }catch(_){}
  return result;
});
patch(NodeProto, "cloneNode", (original)=>function(deep){
  if(__inPicasso || __inNotify) return original.call(this, deep);
  const result = runPicassoOrNative("copy", [raw(this), deep], original, raw(this), [deep], x=>x&&x.nodeType);
  try{ safeNotify({type:"DOM",trigger:"clone",subTrigger:"cloneNode",source:raw(this),clone:result,deep:!!deep,addedNodeCSSRules:safeGetMatchedRules(result)}); }catch(_){}
  return result;
});

// ================= DOM: ParentNode append / prepend =================
[ElementProto, Document.prototype, DocumentFragment.prototype].forEach(proto=>{
  patch(proto, "append", (original)=>function(...children){
    if(__inPicasso || __inNotify) return original.call(this, ...children);
    const p = raw(this), rawChildren = children.map(raw);
    runPicassoOrNative("copy", [p, ...rawChildren], original, p, rawChildren, ()=>true);
    try{ safeNotify({type:"DOM",trigger:"ADD",subTrigger:"append",parent:p,addedNodes:rawChildren,cssRules:safeGetMatchedRules(p)}); }catch(_){}
  });
  patch(proto, "prepend", (original)=>function(...children){
    if(__inPicasso || __inNotify) return original.call(this, ...children);
    const p = raw(this), rawChildren = children.map(raw);
    runPicassoOrNative("copy", [p, ...rawChildren], original, p, rawChildren, ()=>true);
    try{ safeNotify({type:"DOM",trigger:"ADD",subTrigger:"prepend",parent:p,addedNodes:rawChildren,cssRules:safeGetMatchedRules(p)}); }catch(_){}
  });
});

// ================= DOM: ChildNode =================
[ElementProto, CharacterDataProto, DocumentType.prototype].forEach(proto=>{
  patch(proto, "before", (original)=>function(...nodes){
    if(__inPicasso || __inNotify) return original.call(this, ...nodes);
    const p = raw(this);
    runPicassoOrNative("copy", [p, ...nodes.map(raw)], original, p, nodes.map(raw), ()=>true);
    try{ safeNotify({type:"DOM",trigger:"ADD",subTrigger:"before",target:p,addedNodes:nodes.map(raw)}); }catch(_){}
  });
  patch(proto, "after", (original)=>function(...nodes){
    if(__inPicasso || __inNotify) return original.call(this, ...nodes);
    const p = raw(this);
    runPicassoOrNative("copy", [p, ...nodes.map(raw)], original, p, nodes.map(raw), ()=>true);
    try{ safeNotify({type:"DOM",trigger:"ADD",subTrigger:"after",target:p,addedNodes:nodes.map(raw)}); }catch(_){}
  });
  patch(proto, "replaceWith", (original)=>function(...nodes){
    if(__inPicasso || __inNotify) return original.call(this, ...nodes);
    const p = raw(this), prevNext = p.nextSibling;
    runPicassoOrNative("replace", [p, ...nodes.map(raw)], original, p, nodes.map(raw), ()=>true);
    try{ safeNotify({type:"DOM",trigger:"replace",subTrigger:"replaceWith",target:p,newNodes:nodes.map(raw),previousNextSibling:prevNext}); }catch(_){}
  });
  patch(proto, "remove", (original)=>function(){
    if(__inPicasso || __inNotify) return original.call(this);
    const p = raw(this), parent = p.parentNode, prevNext = p.nextSibling;
    runPicassoOrNative("del", [p], original, p, [], ()=>true);
    try{ safeNotify({type:"DOM",trigger:"del",subTrigger:"remove",node:p,parent,previousNextSibling:prevNext,addedNodeCSSRules:safeGetMatchedRules(p),cssRules:safeGetMatchedRules(parent)}); }catch(_){}
  });
});

// ================= DOM: insertAdjacent =================
patch(ElementProto, "insertAdjacentElement", (original)=>function(pos, el){
  if(__inPicasso || __inNotify) return original.call(this, pos, el);
  const p = raw(this), e = raw(el);
  const result = runPicassoOrNative("copy", [p,e,pos], original, p, [pos,e], x=>x&&x.nodeType);
  try{ safeNotify({type:"DOM",trigger:"ADD",subTrigger:"insertAdjacentElement",parent:p,node:result,position:pos}); }catch(_){}
  return result;
});
patch(ElementProto, "insertAdjacentHTML", (original)=>function(pos, html){
  if(__inPicasso || __inNotify) return original.call(this, pos, html);
  const p = raw(this);
  runPicassoOrNative("copy", [p,html,pos], original, p, [pos,html], ()=>true);
  try{ safeNotify({type:"DOM",trigger:"ADD",subTrigger:"insertAdjacentHTML",parent:p,position:pos,html,cssRules:safeGetMatchedRules(p)}); }catch(_){}
  return undefined;
});
patch(ElementProto, "insertAdjacentText", (original)=>function(pos, text){
  if(__inPicasso || __inNotify) return original.call(this, pos, text);
  const p = raw(this);
  runPicassoOrNative("copy", [p,text,pos], original, p, [pos,text], ()=>true);
  try{ safeNotify({type:"DOM",trigger:"ADD",subTrigger:"insertAdjacentText",parent:p,position:pos,text}); }catch(_){}
  return undefined;
});

// ================= DOM: Attributes =================
patch(ElementProto, "setAttribute", (original)=>function(name, value){
  if(__inPicasso || __inNotify) return original.call(this, name, value);
  const el = raw(this), attr = String(name);
  const had = el.hasAttribute(attr), oldValue = el.getAttribute(attr);
  runPicassoOrNative("copy", [el, attr, value], original, el, [name, value], ()=>true);
  try{ safeNotify({type:"DOM",trigger:had?"attr-update":"attr-add",subTrigger:"setAttribute",target:el,attrName:attr,oldValue,newValue:String(value),cssRules:safeGetMatchedRules(el)}); }catch(_){}
});
patch(ElementProto, "removeAttribute", (original)=>function(name){
  if(__inPicasso || __inNotify) return original.call(this, name);
  const el = raw(this), attr = String(name);
  const had = el.hasAttribute(attr), oldValue = el.getAttribute(attr);
  runPicassoOrNative("del", [el, attr], original, el, [name], ()=>true);
  if(had) try{ safeNotify({type:"DOM",trigger:"attr-del",subTrigger:"removeAttribute",target:el,attrName:attr,oldValue,cssRules:safeGetMatchedRules(el)}); }catch(_){}
});
patch(ElementProto, "setAttributeNode", (original)=>function(attrNode){
  if(__inPicasso || __inNotify) return original.call(this, attrNode);
  const el = raw(this);
  const result = runPicassoOrNative("copy", [el, attrNode], original, el, [raw(attrNode)], ()=>true) || el.getAttributeNode(attrNode.name);
  try{ safeNotify({type:"DOM",trigger:"attr-add",subTrigger:"setAttributeNode",target:el,attrNode:result}); }catch(_){}
  return result;
});
patch(ElementProto, "removeAttributeNode", (original)=>function(attrNode){
  if(__inPicasso || __inNotify) return original.call(this, attrNode);
  const el = raw(this);
  const result = runPicassoOrNative("del", [el, attrNode], original, el, [raw(attrNode)], ()=>true) || raw(attrNode);
  try{ safeNotify({type:"DOM",trigger:"attr-del",subTrigger:"removeAttributeNode",target:el,attrNode:result}); }catch(_){}
  return result;
});
patch(ElementProto, "toggleAttribute", (original)=>function(name, force){
  if(__inPicasso || __inNotify) return original.call(this, name, force);
  const el = raw(this), attr = String(name), oldValue = el.getAttribute(attr);
  runPicassoOrNative("copy", [el, attr, force], original, el, [name, force], ()=>true);
  const result = el.hasAttribute(attr);
  try{ safeNotify({type:"DOM",trigger:result?"attr-add":"attr-del",subTrigger:"toggleAttribute",target:el,attrName:attr,oldValue,force}); }catch(_){}
  return result;
});

// ================= DOM: classList =================
["add","remove","toggle","replace"].forEach(m=>{
  patch(DOMTokenList.prototype, m, (original)=>function(...args){
    if(__inPicasso || __inNotify) return original.call(this, ...args);

    // this هنا = DOMTokenList، مش العنصر
    const list = this;
    const owner = list.ownerElement; // ده الأب الحقيقي
    const before = list.value;

    const action = (m==="remove") ? "del" : "copy";

    // Picasso لازم ياخد الـ owner كـ this، مش الـ list
    // والـ Native لازم ياخد الـ list كـ this
    runPicassoOrNative(action, [owner, m, ...args], original, list, args, ()=>true);

    try{
      safeNotify({
        type:"DOM",
        trigger:"class",
        subTrigger:"classList."+m,
        target: owner, // الأب، مش الـ list
        tokenList: list,
        args,
        oldValue: before,
        newValue: list.value,
        cssRules: owner ? safeGetMatchedRules(owner) : undefined
      });
    }catch(_){}

    // toggle و replace بيرجعوا boolean، add و remove بيرجعوا undefined
    if(m==="toggle") return list.contains(args[0]);
    if(m==="replace") return list.contains(args[1]);
    return undefined;
  });
});

// ================= DOM: Setters =================
patchSetter(NodeProto, "textContent", function(originalSet, v){
  if(__inPicasso || __inNotify){ runNative(originalSet, this, [v]); return; }
  const el = raw(this), oldValue = el.textContent;
  runPicassoOrNative("replace", [el, v], originalSet, el, [v], ()=>true);
  try{ safeNotify({type:"DOM",trigger:"text",subTrigger:"textContent",target:el,oldValue,newValue:String(v)}); }catch(_){}
});
patchSetter(ElementProto, "innerHTML", function(originalSet, v){
  if(__inPicasso || __inNotify){ runNative(originalSet, this, [v]); return; }
  const el = raw(this), oldValue = el.innerHTML;
  runPicassoOrNative("replace", [el, v], originalSet, el, [v], ()=>true);
  try{ safeNotify({type:"DOM",trigger:"html",subTrigger:"innerHTML",target:el,oldValue,newValue:String(v),cssRules:safeGetMatchedRules(el)}); }catch(_){}
});
patchSetter(ElementProto, "outerHTML", function(originalSet, v){
  if(__inPicasso || __inNotify){ runNative(originalSet, this, [v]); return; }
  const el = raw(this), parent = el.parentNode, prevNext = el.nextSibling;
  runPicassoOrNative("replace", [el, v], originalSet, el, [v], ()=>true);
  try{ safeNotify({type:"DOM",trigger:"replace",subTrigger:"outerHTML",target:el,parent,previousNextSibling:prevNext,newValue:String(v)}); }catch(_){}
});

// ================= CSSOM =================
function patchRuleContainer(proto){
  if(!proto) return;
  patch(proto, "insertRule", (original)=>function(ruleText, index){
    if(__inPicasso || __inNotify) return original.call(this, ruleText, index);
    const sheet = raw(this);
    const idx = index===undefined ? sheet.cssRules.length : index;
    const result = runPicassoOrNative("copy", [sheet, ruleText, idx], original, sheet, [ruleText, idx], r=>typeof r==="number");
    const newRule = sheet.cssRules ? sheet.cssRules[result] : undefined;
    try{ safeNotify({type:"CSSOM",trigger:"ADD",subTrigger:"insertRule",targetSheet:sheet,index:result,newRule,newRuleText:ruleText}); }catch(_){}
    return result;
  });
  patch(proto, "deleteRule", (original)=>function(index){
    if(__inPicasso || __inNotify) return original.call(this, index);
    const sheet = raw(this);
    const deletedRule = sheet.cssRules ? sheet.cssRules[index] : undefined;
    const deletedText = deletedRule ? deletedRule.cssText : undefined;
    runPicassoOrNative("del", [sheet, index, deletedRule], original, sheet, [index], ()=>true);
    try{ safeNotify({type:"CSSOM",trigger:"del",subTrigger:"deleteRule",targetSheet:sheet,index,deletedRule,deletedRuleText:deletedText}); }catch(_){}
  });
}
patchRuleContainer(CSSStyleSheet.prototype);
if(typeof CSSGroupingRule!=="undefined") patchRuleContainer(CSSGroupingRule.prototype);
if(typeof CSSMediaRule!=="undefined") patchRuleContainer(CSSMediaRule.prototype);
if(typeof CSSSupportsRule!=="undefined") patchRuleContainer(CSSSupportsRule.prototype);
if(typeof CSSLayerBlockRule!=="undefined") patchRuleContainer(CSSLayerBlockRule.prototype);
if(typeof CSSContainerRule!=="undefined") patchRuleContainer(CSSContainerRule.prototype);

patch(CSSStyleSheet.prototype, "replace", (original)=>function(text){
  if(__inPicasso || __inNotify) return original.call(this, text);
  const sheet = raw(this);
  runPicassoOrNative("replace", [sheet, text], original, sheet, [text], ()=>true);
  try{ safeNotify({type:"CSSOM",trigger:"replace",subTrigger:"replace",targetSheet:sheet,text}); }catch(_){}
  return Promise.resolve(sheet);
});
patch(CSSStyleSheet.prototype, "replaceSync", (original)=>function(text){
  if(__inPicasso || __inNotify) return original.call(this, text);
  const sheet = raw(this);
  runPicassoOrNative("replace", [sheet, text], original, sheet, [text], ()=>true);
  try{ safeNotify({type:"CSSOM",trigger:"replace",subTrigger:"replaceSync",targetSheet:sheet,text}); }catch(_){}
});

patch(CSSStyleDeclaration.prototype, "setProperty", (original)=>function(prop, value, priority){
  if(__inPicasso || __inNotify) return original.call(this, prop, value, priority);
  const decl = raw(this), name = String(prop);
  const oldValue = decl.getPropertyValue(name), oldPriority = decl.getPropertyPriority(name);
  runPicassoOrNative("copy", [decl, name, value, priority], original, decl, [prop, value, priority], ()=>true);
  try{ safeNotify({type:"CSSOM",trigger:"style",subTrigger:"setProperty",rule:decl.parentRule||null,parentStyleSheet:decl.parentRule?decl.parentRule.parentStyleSheet:null,prop:name,oldValue,Value:value!=null?String(value):"",oldPriority,Priority:priority?String(priority):""}); }catch(_){}
});
patch(CSSStyleDeclaration.prototype, "removeProperty", (original)=>function(prop){
  if(__inPicasso || __inNotify) return original.call(this, prop);
  const decl = raw(this), name = String(prop);
  const oldValue = decl.getPropertyValue(name), oldPriority = decl.getPropertyPriority(name);
  const result = runPicassoOrNative("del", [decl, name], original, decl, [prop], ()=>true);
  try{ safeNotify({type:"CSSOM",trigger:"style-del",subTrigger:"removeProperty",targetStyle:decl,parentRule:decl.parentRule||null,property:name,oldValue,oldPriority,removedValue:result}); }catch(_){}
  return result;
});
patchSetter(CSSStyleDeclaration.prototype, "cssText", function(originalSet, v){
  if(__inPicasso || __inNotify){ runNative(originalSet, this, [v]); return; }
  const decl = raw(this), oldValue = decl.cssText;
  runPicassoOrNative("replace", [decl, v], originalSet, decl, [v], ()=>true);
  try{ safeNotify({type:"CSSOM",trigger:"style",subTrigger:"cssText",targetStyle:decl,parentRule:decl.parentRule||null,oldValue,newValue:String(v)}); }catch(_){}
});
})();
(()=>{
let __inNotify = false;
let __inPicasso = false;

function safeGetMatchedRules(node){
  if(__inNotify || __inPicasso || !node) return undefined;
  if(typeof Paint==="undefined"||!Paint||typeof Paint.getMatched!=="function") return undefined;
  try{ return Paint.getMatched(node); }catch(_){ return undefined; }
}
function safeNotify(payload){
  if(__inNotify) return;
  if(typeof Notification!=="function") return;
  __inNotify = true;
  try{ Notification(payload); }catch(e){ console.error("[Notify Error]:",e,payload); }
  finally{ __inNotify = false; }
}
function getAction(name){
  if(typeof Picasso!=="undefined" && Picasso.actions && typeof Picasso.actions[name]==="function") return Picasso.actions[name];
  if(typeof window!=="undefined" && window.Picasso && window.Picasso.actions && typeof window.Picasso.actions[name]==="function") return window.Picasso.actions[name];
  return null;
}
function raw(o){
  if(!o||typeof o!=="object") return o;
  return o._target||o.target||o.raw||o.element||o.el||o;
}

const NativeSetProp = CSSStyleDeclaration.prototype.setProperty;
const NativeRemoveProp = CSSStyleDeclaration.prototype.removeProperty;

// ================= setProperty = actions.copy =================
CSSStyleDeclaration.prototype.setProperty = function(prop, value, priority){
  if(__inPicasso || __inNotify) return NativeSetProp.call(this, prop, value, priority);

  const decl = raw(this);
  const name = String(prop);
  const oldValue = decl.getPropertyValue(name);
  const oldPriority = decl.getPropertyPriority(name);
  const copy = getAction("copy");

  __inPicasso = true;
  try{
    if(copy) copy.call(this, decl, name, value, priority);
    else NativeSetProp.call(decl, prop, value, priority);
  }catch(_){
    // لو Picasso ضرب، اعمل Native عشان الستايل ميتكسرش
    NativeSetProp.call(decl, prop, value, priority);
  }finally{ __inPicasso = false; }

  try{
    safeNotify({
      type:"CSSOM",
      trigger:"style",
      subTrigger:"setProperty",
      targetStyle: decl,
      rule: decl.parentRule || null,
      parentStyleSheet: decl.parentRule ? decl.parentRule.parentStyleSheet : null,
      prop: name,
      oldValue,
      Value: value!=null ? String(value) : "",
      oldPriority,
      Priority: priority ? String(priority) : "",
      addedNodeCSSRules: decl.parentRule ? safeGetMatchedRules(decl.parentRule) : undefined
    });
  }catch(_){}

  // setProperty في الأصل بترجع undefined، فمترجعش حاجة
};

// ================= removeProperty = actions.del =================
CSSStyleDeclaration.prototype.removeProperty = function(prop){
  if(__inPicasso || __inNotify) return NativeRemoveProp.call(this, prop);

  const decl = raw(this);
  const name = String(prop);
  const oldValue = decl.getPropertyValue(name);
  const oldPriority = decl.getPropertyPriority(name);
  const del = getAction("del");

  __inPicasso = true;
  try{
    if(del) del.call(this, decl, name);
    else NativeRemoveProp.call(decl, prop);
  }catch(_){
    NativeRemoveProp.call(decl, prop);
  }finally{ __inPicasso = false; }

  try{
    safeNotify({
      type:"CSSOM",
      trigger:"style-del",
      subTrigger:"removeProperty",
      targetStyle: decl,
      parentRule: decl.parentRule || null,
      property: name,
      oldValue,
      oldPriority,
      removedValue: oldValue
    });
  }catch(_){}

  // removeProperty لازم ترجع الـ oldValue، مش undefined
  return oldValue;
};
})();
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
    window.parent.Objects.targetElement = e.target;
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
    window.parent.Objects.targetElement = document.body;
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
  window.parent.Objects.targetElement = e.target;
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
  if(!window.parent.functionsList) {
      window.parent.functionsList = [];
}
  function onChange(callback) {
    window.parent.functionsList.push(callback);
  }
  onChange.toString = function() {
    return `[Picasso Core]`;
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
  if (obj) {
    return new Proxy(obj, {
      set: (t, p, v) => {
        const oldValue = t[p];
        t[p] = v;

        const ev = typeof e !== "undefined" ? e : null;
        const targetEl = ev ? ev.target : null;
        const hasPaint = typeof Paint !== "undefined" && typeof Paint.getMatched === "function";
        const matchedRules =
          targetEl && hasPaint
            ? Paint.getMatched(targetEl, {
                ignore: [
                  Paint.getSheetRoot("items.css"),
                  Paint.getSheetRoot("Components.css"),
                  Paint.getSheetRoot("defaults.css"),
                  Paint.getSheetRoot("none.css"),
                  Paint.getSheetRoot("reset.css"),
                ]
              })
            : undefined;
        const triggerSource =
          window.parent && window.parent.Objects && window.parent.Objects.trigger
            ? window.parent.Objects.trigger
            : "unknown";
        const propTypeVal = typeof returnType === "function" ? returnType(p) : undefined;

        const payload = {
          type: 'CSSOM',
          target: targetEl,
          cssRules: matchedRules,
          prop: p,
          value: v,
          oldValue,
          rule: t.parentRule,
          event: ev,
          trigger: triggerSource,
          propType: propTypeVal
        };

        if (typeof Notification === "function") {
          Notification(payload);
        }
        return true;
      },
      get: (t, p) => {
        const val = t[p];
        const isFunc = typeof val === "function";
        return isFunc ? val.bind(t) : val;
      }
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
      targetElement: e.target,
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
        type: ev.type,
        target: ev.target,
        event:ev,
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
    }, 10);
    
    return;
  }
  main(ev);
  Notification({
        type: ev.type,
        target: ev.target,
        event:ev,
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
    // التحقق المبدئي السريع للخروج المبكر (Guard Clauses)
    if (isSyncing || e.type !== "DOM" || e.trigger !== "addNode") return;

    const { target: parent, addedNode } = e;
    
    // بناء محدد (Selector) دقيق يشمل الـ tagName والـ type إذا وجد
    let selector = `:scope > ${addedNode.localName}`;
    if (addedNode.tagName === 'INPUT' && addedNode.type) {
        selector += `[type="${addedNode.type}"]`;
    }
    selector += `:not([data-function])`;

    const siblings = parent.querySelectorAll(selector);
    
    // نحتاج على الأقل عنصرين لتحديد النموذج (Archetype) والعنصر الجديد
    if (siblings.length >= 2) {
        isSyncing = true;
        
        try {
            // اختيار العنصر المرجعي (قبل الأخير)
            const archetype = siblings[siblings.length - 2];
            
            if (archetype && archetype !== addedNode) {
                const newNode = Paint.deepCloneNodeWithStyles(archetype);
                
                // تنظيف الأبناء إن وجدوا بطريقة آمنة
                if (newNode.children && newNode.children.length > 0) {
                    Array.from(newNode.children).forEach((child) => {
                        if (child && typeof window.actions?.del === 'function') {
                            window.actions.del(child);
                        }
                    });
                }
                
                // إزالة الـ ID لتجنب التكرار (Duplicate IDs)
                newNode.removeAttribute('id');
                
                // استبدال العنصر المضاف بالنسخة المحسنة
                parent.replaceChild(newNode, addedNode);
            }
        } catch (error) {
            console.error("Error during node synchronization:", error);
        } finally {
            // ضمان إعادة تعيين حالة المزامنة دائماً مهما حدث
            isSyncing = false;
        }
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
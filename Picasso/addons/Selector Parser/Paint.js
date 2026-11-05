if(window.CSSStyleSheet && document.adoptedStyleSheets) {
  window.sheetX = new CSSStyleSheet();
  window.CSSInsertEngine = sheetX;
} else if((!window.CSSStyleSheet) || (!document.adoptedStyleSheets)) {
  const style = document.createElement("style");
  style.id="Paint-Emergency-CSSEngine";  
  document.head.appendChild(style);
  window.sheetX = style.sheet;
  window.CSSInsertEngine = sheetX;
  console.log(`Backup engine is Running....`);
}
window.CSSEngine = document.styleSheets;
CSSInsertEngine.insertRule("html {}",CSSInsertEngine.cssRules.length);
CSSInsertEngine.insertRule("body {}",CSSInsertEngine.cssRules.length);
function Paint(selector,cssText) {
	
var insertOne = function (CSSCode) {
  if(! window.CSSInsertEngine) return;
  if (CSSInsertEngine && CSSInsertEngine.insertRule) {
    CSSInsertEngine.insertRule(CSSCode, CSSInsertEngine.cssRules.length);
    if (!document.adoptedStyleSheets.includes(CSSInsertEngine) && CSSInsertEngine && window.CSSStyleSheet) {
      if(window.CSSStyleSheet && CSSInsertEngine instanceof CSSStyleSheet) {
        document.adoptedStyleSheets = [...document.adoptedStyleSheets, CSSInsertEngine];
      }
    }
    const alreadyInEngine = Array.from(CSSEngine).includes(CSSInsertEngine);
    if (!alreadyInEngine && CSSInsertEngine instanceof CSSStyleSheet) {
      CSSEngine = [...CSSEngine, CSSInsertEngine];
    }
  }
};
	
const CSSCode = `${selector}{
  ${cssText}
}`;

insertOne(CSSCode);
	return new Proxy({},  {  
    get(_, pseudoClass) {  
      return (...styles) => {  
        if(pseudoClass){
        	const CSSCode = `${selector}:${pseudoClass}{
  ${pseudoClass,styles}
}`;
        	insertOne(CSSCode);
        }
      };  
    }  
  });
}
Paint.identity = function(ref) {
  if(ref.outerHTML) {
    if(!ref.hasAttribute("node-id") || ref.getAttribute("node-id") == "") {
       ref.setAttribute("node-id",Math.random().toString(36).substring(2, 8));
    }
    var l = ref.querySelectorAll("*");
  if(l.length >= 1) {
      for(n of l) {
        if(n) {
          Paint.identity(n);
        }
      }
    }
  }
if(ref instanceof CSSStyleRule) {
if(!ref.style.getPropertyValue("--rule-id")) {
    ref.style.setProperty("--rule-id",Math.random().toString(36).substring(2, 8));
    }
  }
if(ref instanceof CSSStyleSheet) {
  for (R of ref.cssRules) {
    if(R) {
      Paint.identity(R);
    }
  }
}
if(ref instanceof CSSRule && ref.cssRules.length >= 1) {
  for (R of ref.cssRules) {
    if(R) {
      Paint.identity(R);
    }
  }
}
  return ref;
};

Paint.addRule = function(target, ruleText) {
    if (!target) target = CSSInsertEngine;

    if (target instanceof CSSMediaRule || CSSContainerRule) {
        target.insertRule(ruleText, target?.cssRules?.length);
    } 
     else if (target instanceof CSSStyleSheet) {
        target.insertRule(ruleText, target.cssRules.length);
    } 
    else {
        console.warn("Paint.addRule: Invalid target for insertRule", target);
    }
    return target.cssRules[target?.cssRules?.length - 1];
};
Paint.getCSSObj = function(selector, options = {}) {
    const { multiple = false, pseudo, Create = false } = options; 

    let results = [];
    
    if (Create && !Paint.exists(selector)) {
        Paint(selector, "");
    }

    for (const CSSs of CSSEngine) {
        if (!CSSs.cssRules) continue;

        for (const Rules of CSSs.cssRules) {
            if (Rules.constructor.name !== "CSSStyleRule") continue; 
            
            const selText = Rules.selectorText;
            if (!selText) continue;

            const matches = selText.includes(selector);
            
            if (!matches) continue;

            const hasPseudo = selText.includes(":");
            
            if (pseudo === "only" && !hasPseudo) continue;
            
            if (pseudo === false && hasPseudo) continue; 

            if (!multiple) {
                return Rules.style;
            }
            results.push(Rules);
        }
    }
    
    return multiple ? results : false;
};

Paint.getCSS = function (selector, options = {}) {
	const {
		multiple = false,
		pusedo
	} = options;

	const regex = new RegExp(selector.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&'), "g");
	let results = [];

	for (const CSSs of CSSEngine) {
		for (const Rules of CSSs.cssRules) {
			if (!Rules.selectorText) continue;

			const selText = Rules.selectorText;
			const hasPseudo = selText.includes(":");
			const matches = regex.test(selText);

			if (!matches) continue;

			if (pusedo === "only" && !hasPseudo) continue;
			if (pusedo === false && hasPseudo) continue;

			if (!multiple) return Rules.style.cssText;
			results.push(Rules.style.cssText);
		}
	}

	return multiple ? results : false;
};
Paint.fail = function (){

window.CSSStyleSheet = undefined;
document.adoptedStyleSheet = undefined;
};
Paint.exists = function (selector) {
  const escapedSelector = selector.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&');
  const regex = new RegExp(`^${escapedSelector}$`);

  for (const CSSs of CSSEngine) {
    let rules;
    try {
      rules = CSSs.cssRules;
    } catch {
      continue;
    }

    for (const rule of rules) {
      if (rule.selectorText && regex.test(rule.selectorText.trim())) {
        return true;
      }
    }
  }
  return false;
};
Paint.getComputed = function (selector){
	return window.getComputedStyle(document.querySelector(selector));
};
Paint.getSheet = function (url){
	let final = {};
	for (const sht of Array.from(document.styleSheets)) {
		if(String(sht.href).includes(url)){
		  final = sht;
		}
	}
	return final.cssRules;
};
Paint.getSheetRoot = function (url){
	let final = {};
	for (const sht of Array.from(document.styleSheets)) {
		if(String(sht.href).includes(url)){
		  final = sht;
		}
	}
	return final;
};
Paint.createSheet = function(CSSCode) {
    if (typeof CSSStyleSheet === "function" && CSSStyleSheet.prototype.replaceSync) {
        try {
            const sheet = new CSSStyleSheet();
            sheet.replaceSync(CSSCode);
            return sheet;
        } catch (error) {
            console.warn("Failed to create constructed stylesheet:", error);
        }
    } else {
  let Parser = new DOMParser();
	let DOM = Parser.parseFromString(`
	<style id="fallback">${CSSCode}</style>
	`,"text/html");
	return DOM.querySelector("style").sheet;
  }
};
Paint.setSheet = function(sheet) {
    if(sheet) {
      window.CSSInsertEngine = sheet;
    }
};
Paint.insertMany = async function(CSSCode) {
	for (const [index, rule] of Array.from(Paint.createSheet(CSSCode).cssRules).entries()) {
		Paint.addRule(CSSInsertEngine,rule.cssText);
	}
};
Paint.findQuery = function(options) {
  var ruleX = false;
  var Q = false;
  if(CSSInsertEngine) {
    Q = CSSInsertEngine.cssRules ? Array.from(CSSInsertEngine.cssRules) : false;
  }
  if(Q) {
    for (const rule of Q) {
      if(String(rule.conditionText).replaceAll(" ","") == String(options.condition).replaceAll(" ","")) {
        ruleX = rule;
      }
    }
  }
  if (!ruleX) {
    if(options.Create == true) {
      Paint.addRule(CSSInsertEngine,`@media ${options.condition} {}`);
    }
    if(Q) {
      Q = Array.from(CSSInsertEngine.cssRules);
      for (const rule of Q) {
        if(String(rule.conditionText).replaceAll(" ","") == options.condition.replaceAll(" ","")) {
          ruleX = rule;
        }
      }
    }
  }
  for (fun of window.parent.functionsList) {
    if(typeof fun == "function") {
      fun({
        type: "CSSOM",
        trigger: "ADD",
        rule: ruleX,
        subTrigger: "mediaQuery"
      });
    }
  }
  return ruleX ? ruleX : false;
};

Paint.restore = function (){
window.CSSInsertEngine = sheetX;
window.CSSEngine = document.styleSheets;
console.log(`All defaults are reset`);
};
Paint.root = {
  ref: Paint.getCSSObj(":root",{Create: true}),
  set: function (variable, value) {
    return Paint.getCSSObj(":root",{Create: true}).setProperty(variable, value);
  },
  get: function (variable) {
    return Paint.getCSSObj(":root",{Create: true}).getPropertyValue(variable);
  },
  delete: function (variable) {
  	Paint.getCSSObj(":root",{Create: true}).removeProperty(variable);
  }
};
Paint.findRule = function(obj) {
  var res = [];

  if (!obj || !obj.sheet || !obj.sheet.cssRules) {
    return res;
  }

  for (const [i, r] of Array.from(obj.sheet.cssRules).entries()) {
    // تخطي القواعد التي لا تحتوي على selectorText أو التي تطابق :root
    if (!r.selectorText || r.selectorText === ":root" || !r.style) {
      continue;
    }

    // استخدام Paint.parse لتحليل نص الستايل بدقة متناهية
    let styleObj = Paint.parse(r.style.cssText);
    
    var ruleObj = {
      selectorText: r.selectorText,
      style: styleObj,
      ref: r,
      props: [],
      shared_value: obj.value
    };

    let hasMatch = false;

    for (const p of Object.keys(styleObj)) {
      let propValue = String(styleObj[p]).trim();
      let matchProp = false;
      let matchVal = false;
      let matchStart = false;

      // 1. البحث باسم الخاصية (prop) مع تجاهل حالة الحروف
      if (obj.prop && p.toLowerCase() === String(obj.prop).toLowerCase()) {
        matchProp = true;
      }

      // 2. البحث بالقيمة التامة (value)
      if (obj.value !== undefined && propValue === String(obj.value).trim()) {
        matchVal = true;
      }

      // 3. البحث بـ startsWith
      if (obj.startsWith && obj.value !== undefined && propValue.startsWith(String(obj.value))) {
        matchStart = true;
      }

      // تسجيل الخاصية المطابقة
      if (matchProp || matchVal || matchStart) {
        if (!ruleObj.props.includes(p)) {
          ruleObj.props.push(p);
        }
        hasMatch = true;
      }
    }

    // إضافة القاعدة للنتائج إذا كانت مطابقة لشروط البحث
    if (hasMatch) {
      if (!res.includes(ruleObj)) {
        res.push(ruleObj);
      }
    }

    // دعم البحث الإضافي بـ startsWith على مستوى القيم ككل إذا طُلب ذلك
    if (obj.startsWith && obj.value !== undefined) {
      for (const g of Object.values(styleObj)) {
        if (String(g).startsWith(String(obj.value))) {
          if (!res.includes(ruleObj.ref)) {
            res.push(ruleObj.ref);
          }
        }
      }
    }
  }

  return res;
};

Paint.getRulesOf = function(sht) {
  var rules = [];
  for (const r of Array.from(sht.cssRules)) {
    rules.push(r);
  }
  return rules;
};
Paint.parse = function(code) {
    const ruleObj = {};
    let depth = 0;      // لتتبع عمق الأقواس (لـ functions مثل linear-gradient)
    let inQuotes = null; // لتتبع علامات التنصيص (لـ content)
    let start = 0;
    const str = String(code).trim();

    for (let i = 0; i < str.length; i++) {
        const char = str[i];

        // تتبع علامات التنصيص لضمان عدم كسر القيم بداخلها
        if ((char === '"' || char === "'") && (i === 0 || str[i - 1] !== '\\')) {
            if (!inQuotes) inQuotes = char;
            else if (inQuotes === char) inQuotes = null;
        }

        // تتبع الأقواس فقط إذا لم نكن داخل علامات تنصيص
        if (!inQuotes) {
            if (char === '(') depth++;
            if (char === ')') depth--;
        }

        // التقسيم يحدث فقط إذا وجدنا ; ولسنا داخل أقواس أو تنصيص
        if (char === ';' && depth === 0 && !inQuotes) {
            const part = str.substring(start, i).trim();
            if (part) {
                const colonIndex = part.indexOf(':');
                if (colonIndex > -1) {
                    const prop = part.substring(0, colonIndex).trim();
                    const value = part.substring(colonIndex + 1).trim();
                    if (prop && value) ruleObj[prop] = value;
                }
            }
            start = i + 1;
        }
    }

    // معالجة الجزء المتبقي بعد آخر فاصلة منقوطة
    const lastPart = str.substring(start).trim();
    if (lastPart) {
        const colonIndex = lastPart.indexOf(':');
        if (colonIndex > -1) {
            const prop = lastPart.substring(0, colonIndex).trim();
            const value = lastPart.substring(colonIndex + 1).trim();
            if (prop && value) ruleObj[prop] = value;
        }
    }

    return ruleObj;
};

Paint.stringify = function(O) {
  var text = "";
  for (const Q of Object.keys(O)) {
    if(Q && O[Q]) {
      text+=`${Q}: ${O[Q]};`;
    }
  }
  return text;
};
Paint.createVariable = function (rootRef, value, prop) {
  if (String(value).startsWith("var(")) return value;

  function GetThree(w) {
    return String(w).slice(0, 3).trim();
  }

  let rootStyle = null;
  let targetSheet = null;

  // إذا تم تمرير الـ style مباشرة أو كـ CSSStyleRule
  if (rootRef instanceof CSSStyleDeclaration) {
    rootStyle = rootRef;
  } else if (rootRef instanceof CSSStyleRule) {
    rootStyle = rootRef.style;
  } else if (rootRef && typeof rootRef.cssRules !== "undefined") {
    // إذا تم تمرير StyleSheet
    targetSheet = rootRef;
    let rules = [];
    try {
      rules = Array.from(targetSheet.cssRules);
    } catch (e) {
      return value;
    }

    let rootRule = rules.find(
      r => r.type === CSSRule.STYLE_RULE && r.selectorText && r.selectorText.trim() === ":root"
    );

    if (!rootRule) {
      try {
        targetSheet.insertRule(":root {}", targetSheet.cssRules.length);
        rootRule = Array.from(targetSheet.cssRules).find(
          r => r.type === CSSRule.STYLE_RULE && r.selectorText && r.selectorText.trim() === ":root"
        );
      } catch (e) {
        console.warn("Could not insert :root rule", e);
        return value;
      }
    }
    if (rootRule) rootStyle = rootRule.style;
  }

  if (!rootStyle) return value;

  const AST = Paint.parse(rootStyle.cssText || "");

  for (const k in AST) {
    if (String(AST[k]).trim() === String(value).trim()) {
      return `var(${k})`;
    }
  }

  function uniqueVar(prefix) {
    let name;
    do {
      name = `${prefix.trim()}${crypto.randomUUID().slice(0, 8).trim()}`;
    } while (AST[name]);
    return name;
  }

  const varname = uniqueVar(`--${GetThree(prop)}`);
  rootStyle.setProperty(varname, value);

  return `var(${varname})`;
};

Paint.exportSheet = function(ref) {
  if (!ref?.cssRules) return "";

  function indent(text, spaces) {
    var pad = ' '.repeat(spaces);
    return text.split('\n').map(line => line ? pad + line : line).join('\n');
  }

  // يستخرج محتوى { ... } من cssText ويمررها لـ Paint.parse
  function formatDeclarations(cssText) {
    var body = cssText.slice(cssText.indexOf('{') + 1, cssText.lastIndexOf('}'));
    var AST = Paint.parse(body.trim());
    var text = "";
    for (var prop in AST) {
      if (prop) text += `\n  ${prop}: ${AST[prop]};`;
    }
    return text;
  }

  var text = "";

  for (var rule of ref.cssRules) {

    // قاعدة عادية
    if (rule instanceof CSSStyleRule) {
      text += `${rule.selectorText} {${formatDeclarations(rule.cssText)}\n}\n`;
      continue;
    }

    // @font-face
    if (typeof CSSFontFaceRule !== 'undefined' && rule instanceof CSSFontFaceRule) {
      text += `@font-face {${formatDeclarations(rule.cssText)}\n}\n`;
      continue;
    }

    // @page
    if (typeof CSSPageRule !== 'undefined' && rule instanceof CSSPageRule) {
      text += `@page ${rule.selectorText || ''} {${formatDeclarations(rule.cssText)}\n}\n`;
      continue;
    }

    // @counter-style
    if (typeof CSSCounterStyleRule !== 'undefined' && rule instanceof CSSCounterStyleRule) {
      text += `@counter-style ${rule.name} {${formatDeclarations(rule.cssText)}\n}\n`;
      continue;
    }

    // @keyframes (فيها CSSKeyframeRule اللي عنده keyText بدل selectorText)
    if (typeof CSSKeyframesRule !== 'undefined' && rule instanceof CSSKeyframesRule) {
      var inner = "";
      for (var kf of rule.cssRules) {
        inner += `${kf.keyText} {${formatDeclarations(kf.cssText)}\n}\n`;
      }
      text += `@keyframes ${rule.name} {\n${indent(inner.trim(), 2)}\n}\n`;
      continue;
    }

    // @media
    if (rule instanceof CSSMediaRule) {
      var inner = Paint.exportSheet(rule) || "";
      text += `@media ${rule.conditionText} {\n${indent(inner.trim(), 2)}\n}\n`;
      continue;
    }

    // @supports
    if (typeof CSSSupportsRule !== 'undefined' && rule instanceof CSSSupportsRule) {
      var inner = Paint.exportSheet(rule) || "";
      text += `@supports ${rule.conditionText} {\n${indent(inner.trim(), 2)}\n}\n`;
      continue;
    }

    // @container
    if (typeof CSSContainerRule !== 'undefined' && rule instanceof CSSContainerRule) {
      var inner = Paint.exportSheet(rule) || "";
      text += `@container ${rule.conditionText} {\n${indent(inner.trim(), 2)}\n}\n`;
      continue;
    }

    // @layer (الشكل اللي فيه بلوك محتوى)
    if (typeof CSSLayerBlockRule !== 'undefined' && rule instanceof CSSLayerBlockRule) {
      var inner = Paint.exportSheet(rule) || "";
      text += `@layer ${rule.name || ''} {\n${indent(inner.trim(), 2)}\n}\n`;
      continue;
    }

    // @layer (شكل التصريح فقط بدون محتوى: @layer a, b;)
    if (typeof CSSLayerStatementRule !== 'undefined' && rule instanceof CSSLayerStatementRule) {
      text += `@layer ${rule.nameList.join(', ')};\n`;
      continue;
    }

    // @import / @namespace ما فيهم تفكيك، منرجعهم زي ما هم
    if (rule instanceof CSSImportRule ||
        (typeof CSSNamespaceRule !== 'undefined' && rule instanceof CSSNamespaceRule)) {
      text += `${rule.cssText}\n`;
      continue;
    }

    // أي نوع غير مدعوم صراحة - fallback لـ cssText الخام
    text += `${rule.cssText}\n`;
  }

  return text != "" ? text : false;
};
Paint.minify = function(sheet, options) {
  if (!sheet || !sheet.cssRules) return;

  var rootRef = [...sheet.cssRules].find(r => r.selectorText === ":root");
  if (!rootRef) {
    rootRef = Paint.addRule(sheet, ":root {}");
  }

  // التأكد من تمرير options و SupportsOnly بشكل افتراضي لمنع الأخطاء
  const supportsList = options && options.SupportsOnly ? options.SupportsOnly : [];

  for (const rule of sheet.cssRules) {
    if (rule && rule.constructor.name === "CSSStyleRule" && rule.selectorText !== ":root") {
      const AST = Paint.parse(rule.style.cssText || rule.cssText);
      
      for (const [prop, val] of Object.entries(AST)) {
        if (supportsList.length > 0) {
          // التحقق مما إذا كانت القيمة أو الخاصية تدعمها CSS.supports بناءً على القائمة الممررة
          const isSupported = supportsList.some(p => CSS.supports(p, val));
          var ignore = ["currentcolor","initial"];
          if (isSupported && !ignore.includes(val) && !options.ignoreProps.includes(prop)) {
          rule.style.setProperty(prop,Paint.createVariable(rootRef, val,prop));
          }
        }
      }
    }
  }
};


Paint.deleteRule = function(obj) {
  var eng = obj.sheet;
  var selectorText = obj.selector;
  for (const [i, rule] of Array.from(eng.cssRules).entries()) {
    if(String(rule.selectorText).trim() == String(selectorText).trim()) {
      eng.deleteRule(i);
    }
  }
  console.log(`${selectorText} Successfully Removed`);
};
Paint.typeof = function(rule, options) {
  var e = undefined;
   if(typeof rule === "string") {
     e = Paint.createSheet(rule).cssRules[0].constructor.name;
   } else if(rule instanceof CSSRule) {
     e = rule.constructor.name;
   }
   if(options && options.operator) {
     return eval(e);
   } else {
     return e;
   }
};
Paint.deepCloneNodeWithStyles = function(originalNode,parent) {
  var newRules = [];
    if (!originalNode) return;
    const clone = originalNode.cloneNode(true);
    const elementsMap = new Map();
    const clonesMap = new Map(); // original -> clone element (بديل عن currentIndex الخاطئ)

    const originals = [originalNode, ...originalNode.querySelectorAll("*")];
    const clones = [clone, ...clone.querySelectorAll("*")];

    for (const [index, el] of originals.entries()) {
        const uniqueClass = `pc-${el.tagName.toLowerCase()}-${Math.random().toString(36).substring(2, 7)}`;
        elementsMap.set(el, uniqueClass);
        clonesMap.set(el, clones[index]);
        clones[index].className = uniqueClass;
    }

    const notifyAdd = (newRuleText, sourceRule) => {
        const funcs = window.parent.functionsList;
        for (const fun in funcs) {
            const f = funcs[fun];
            if (typeof f === "function") {
                const lastIndex = window.CSSInsertEngine.cssRules.length === 1
                    ? 0
                    : window.CSSInsertEngine.cssRules.length - 1;
                f({
                    type: "CSSOM",
                    trigger: "ADD",
                    targetSheet: window.CSSInsertEngine,
                    index: lastIndex,
                    newRule: Paint.identity(window.CSSInsertEngine.cssRules[lastIndex]),
                    newRuleText,
                    source: sourceRule,
                    parentStyleSheet: sourceRule.parentStyleSheet,
                    parentRule: sourceRule.parentRule
                });
            }
        }
    };

    // يحذف نوع الـ tag تماماً من المجموعة ويبقي فقط pseudo / pseudo-element، ثم يضيف class الجديد
    const rebuildGroupWithClass = (group, targetEl) => [
        {
            type: "attribute",
            name: "class",
            action: "element",
            value: elementsMap.get(targetEl),
            ignoreCase: "quirks"
        },
        ...group.filter(t => t.type === "pseudo" || t.type === "pseudo-element")
    ];

    // لكل عنصر: مجموعة الـ CSSMediaRule الأصلية (المصدر) التي تمت توسعتها له بالفعل
    // تمنع إعادة معالجة نفس الميديا لنفس العنصر لو تكررت ضمن matchedRules
    const processedMediaForEl = new Map();
    const funcs = window.parent.functionsList;
    for (const fun in funcs) {
        const f = funcs[fun];
        if (typeof f === "function") {
            f({
              type: "CSSOM",
              trigger: 'addRule',
              subTrigger: "insert-started",
              cssRules: newRules
            });
        }
    }
    for (const el of originals) {
        const matchedRules = Paint.getMatched(el);

        for (const { rule } of matchedRules) {
            try {
                if (rule.parentRule instanceof CSSMediaRule) {
                    const sourceMedia = rule.parentRule;

                    let doneSet = processedMediaForEl.get(el);
                    if (!doneSet) {
                        doneSet = new Set();
                        processedMediaForEl.set(el, doneSet);
                    }
                    if (doneSet.has(sourceMedia)) continue; // سبق توسيع هذه الميديا لهذا العنصر
                    doneSet.add(sourceMedia);

                    // findQuery تضمن عدم تكرار نفس @media عبر كامل CSSInsertEngine (تبحث بـ conditionText)
                    // وتعيد بلوك فارغ جاهز إن لم يكن موجوداً، أو الموجود نفسه إن كان مكرراً
                    const mediarule = Paint.findQuery({
                        condition: sourceMedia.conditionText,
                        Create: true
                    });

                    // أعد ضخ القواعد الأصلية (من sourceMedia مباشرة، غير معدّلة) بعد تحديث selectors فقط للمطابقة
                    for (const internal of sourceMedia.cssRules) {
                        const ast2 = CSSSelector.parse(internal.selectorText);
                        let touched = false;
                        const updatedAst2 = ast2.map(group => {
                            if (Paint.matchesSelector(el, CSSSelector.stringify([group]))) {
                                touched = true;
                                return rebuildGroupWithClass(group, el);
                            }
                            return group;
                        });

                        if (touched) {
                            const newInternalRuleText = `${CSSSelector.stringify(updatedAst2)} { ${internal.style.cssText} }`;
                            mediarule.insertRule(newInternalRuleText, mediarule.cssRules.length);
                        }
                    }

                    notifyAdd(mediarule.cssText, rule);
                } else {
                    const ast = CSSSelector.parse(rule.selectorText);
                    const updatedAst = ast.map(group =>
                        Paint.matchesSelector(el, CSSSelector.stringify([group]))
                            ? rebuildGroupWithClass(group, el)
                            : group
                    );
                    const newSelector = CSSSelector.stringify(updatedAst);
                    const newRuleText = `${newSelector} { ${rule.style.cssText} }`;

                   var newRuleToSave = Paint.identity(Paint.addRule(window.CSSInsertEngine, newRuleText));
                   newRules.push({
                     rule: newRuleToSave,
                     styleSheet: window.CSSInsertEngine,
                     cssText: newRuleText
                   });
                    notifyAdd(newRuleText, rule);
                }
            } catch (e) {
                console.error("خطأ في معالجة المحدد:", e);
            }
        }
    }

    if (window.CSSInsertEngine instanceof CSSStyleSheet && !document.adoptedStyleSheets.includes(window.CSSInsertEngine)) {
        document.adoptedStyleSheets = [...document.adoptedStyleSheets, window.CSSInsertEngine];
    }

    for (const fun in funcs) {
        const f = funcs[fun];
        if (typeof f === "function") {
          f({
              type: "CSSOM",
              trigger: 'addRule',
            subTrigger: "insert-finished",
              cssRules: newRules,
              node: clone,
              parent: parent
            });
        }
    }

    return Paint.identity(clone);
};
Paint.addRule = function(engine, ruleText) {
    try {
        if (engine.insertRule) {
            engine.insertRule(ruleText, engine.cssRules.length);
        } else if (engine.appendRule) {
            engine.appendRule(ruleText);
        }
    } catch (e) {
        console.warn("فشل حقن القاعدة:", ruleText, e);
    }
    return engine.cssRules[engine.cssRules.length - 1];
};




Paint.matchesSelector = function(el, selector) {
        try {
            const ast = CSSSelector.parse(selector);
            const cleanedSelector = ast.map(group => 
                group.filter(t => t.type !== "pseudo" && t.type !== "pseudo-element")
            ).filter(g => g.length > 0);
            
            const finalStr = CSSSelector.stringify(cleanedSelector);
            return finalStr && el.matches(finalStr);
        } catch (e) { return false; }
    };
Paint.indexOf = function(reference) {

  if (!reference) return -1;

  // CSSStyleSheet
  if (reference instanceof CSSStyleSheet) {
    return Array.from(document.styleSheets)
      .indexOf(reference);
  }

  // CSSStyleRule داخل MediaRule
  if (reference.parentRule) {
    return Array.from(reference.parentRule.cssRules)
      .indexOf(reference);
  }

  // CSSStyleRule عادى
  if (reference.parentStyleSheet) {
    return Array.from(reference.parentStyleSheet.cssRules)
      .indexOf(reference);
  }

  return -1;
};
Paint.getMatched = function(el, options) {
  var rules = [];
  for (const sheet of Array.from([CSSInsertEngine,...document.styleSheets])) {
    if(options && options.ignore && !options.ignore.includes(sheet)) {
      for (const [i, rule] of Array.from(sheet.cssRules).entries()) {
      if(Paint.matchesSelector(el,rule.selectorText)) {
      rules.push({
        rule,
        styleSheet: rule.parentStyleSheet,
        index: Paint.indexOf(rule)
      });
    }
    if(rule?.cssRules?.length > 0) {
      var l = Array.from(rule.cssRules);
      l.forEach((c)=>{
        if(c) {
          if(Paint.matchesSelector(el,c.selectorText)) {
            rules.push({
              styleSheet: rule,
              rule: c,
              index: Paint.indexOf(c)
            });
          }
        }
      });
    }
    }
    }
    if(!options) {
      for (const [i, rule] of Array.from(sheet.cssRules).entries()) {
      if(Paint.matchesSelector(el,rule.selectorText)) {
      rules.push({
        rule,
        styleSheet: rule.parentStyleSheet,
        index: Paint.indexOf(rule)
      });
    }
    if(rule?.cssRules?.length > 0) {
      var l = Array.from(rule.cssRules);
      l.forEach((c)=>{
        if(c) {
          if(Paint.matchesSelector(el,c.selectorText)) {
            rules.push({
              styleSheet: rule,
              rule: c,
              index: Paint.indexOf(c)
            });
          }
        }
      });
    }
    }
    }
  }
  return rules;
};
Paint.deepClone = function(originalNode) {
    if (!originalNode) return;

    const originals = [originalNode, ...originalNode.querySelectorAll("*")];
    const elementsMap = new Map();

    const clone = originalNode.cloneNode(true);
    const clones = [clone, ...clone.querySelectorAll("*")];

    for (const [index, el] of originals.entries()) {
        const uniqueClass = `${el.tagName.toLowerCase()}-${Math.random().toString(36).substring(2, 8)}`;
        elementsMap.set(el, uniqueClass);
        clones[index].className = uniqueClass;
    }

    for (const el of originals) {
        const matchedRules = Paint.getMatched(el);
        const newClass = elementsMap.get(el);

        for (const { rule } of matchedRules) {
            try {
                const ast = CSSSelector.parse(rule.selectorText);
                
                const updatedAst = ast.map(group => {
                    if (Paint.matchesSelector(el, CSSSelector.stringify([group]))) {
                        return [
                            { type: "attribute", name: "class", action: "element", value: newClass, ignoreCase: "quirks" },
                            ...group.filter(t => t.type === "pseudo" || t.type === "pseudo-element")
                        ];
                    }
                    return group;
                });

                const newSelector = CSSSelector.stringify(updatedAst);
                const newRuleText = `${newSelector} { ${rule.style.cssText} }`;
                
                Paint.addRule(window.CSSInsertEngine, newRuleText);
            } catch (e) {
                console.error("Cloning Rule Error:", e);
            }
        }
    }

    return clone;
};
Paint.updateSheet = function(ref,cssText) {
  if(!ref.ownerNode) {
    ref.replaceSync(cssText);
  } else {
    for (rule of ref.cssRules) {
      if(rule) {
        ref.deleteRule(Paint.indexOf(rule));
      }
    }
    for (rule of Paint.createSheet(cssText).cssRules) {
      ref.insertRule(rule.cssText,ref.cssRules.length);
    }
  }
    return ref;
};
window.Paint = Paint;
class HistoryNode {
  constructor(obj) {
    // لو الحدث جاى متغلف (Proxy بتاع الـ cascade) بنشتغل على الأصلى
    obj = (typeof PICASSO_RAW !== "undefined" && obj && obj[PICASSO_RAW]) || obj;
    return new Proxy(obj,{
      get: (t, p) => {
        if (p === "node") {
          if (t.node && !t.node.isConnected) {
            const _node_id = t.node.getAttribute("node-id");
            if (_node_id) {
              var newNode = Entrypoint.document.querySelector(`[node-id="${_node_id}"]`);
              if (newNode && newNode.isConnected) {
                t.node = newNode;
              }
            }
          }
        }
        
        if (p === "rule") {
          // التحقق من وجود القواعد قبل محاولة قراءة الـ style
          const ruleObj = t.rule?.rule;
          if (ruleObj && !ruleObj.parentStyleSheet && !ruleObj.parentRule) {
            const RULE_ID = ruleObj.style?.getPropertyValue("--rule-id");
            if (RULE_ID && typeof Entrypoint.findRule === "function") {
              t.rule.rule = Entrypoint.findRule({
                prop: "--rule-id",
                value: RULE_ID
              });
            }
          }
          // لو المطور هو إلى بيقرا الـ rule (مش النظام وهو بينفذ undo/redo)
          // بنرجع نسخة مراقَبة، أى تعديل على rule.style بيتسجل كـ HistoryNode جديدة
          if (t.type === "CSSOM" && typeof Picasso !== "undefined" && Picasso.history && !Picasso.history.isInternal) {
            return Picasso.history._watchRule(t.rule);
          }
        }
        
        return t[p];
      },
      set: (t, p, v) => {
        t[p] = v;
        return true; // يفضل إرجاع true عند النجاح في الـ Proxy set
      }
    });
  }
}
// مفتاح بنستخدمه عشان نوصل للـ object الأصلى من ورا الـ Proxy
var PICASSO_RAW = Symbol("Picasso.raw");
// raw rule -> watched proxy (عشان نفس الـ rule يرجع دايما نفس الـ Proxy)
var PICASSO_WATCHED = new WeakMap();
// callback أصلى <-> الـ wrapper المسجل فى functionsList
var PICASSO_WRAPPERS = new WeakMap();
var PICASSO_ORIG_OF = new WeakMap();
// علامة إن الـ functionsList اتعدلت (push بيلف الـ callbacks)
var PICASSO_PATCHED = Symbol("Picasso.patched");
// حدث cascade -> مجموعة الـ callbacks إلى مش هتتنادى عليه (كل callback بيرد مرة واحدة فى السلسلة)
var PICASSO_EXCLUDE = new WeakMap();
var Picasso = {
    history: {
        Stack: [],
        index: 0,
        current: null,
        method: null,
        // > 0 طول ما كود داخلى (النظام) شغال، وقتها أى تعديل مش بيتحسب كتغيير
        _applying: 0,
        // أى كود داخلى (فى History.js أو أى module تانى تابع للنظام) لازم يلف عملياته
        // على rule / node من التاريخ جوه silent(). كل اللى برّاها بيتعامل معاه كتعديل خارجى.
        // مثال: Picasso.history.silent(() => { node.rule.style.color = "red"; });
        silent: function(fn) {
          this._applying++;
          try {
            return fn.call(this);
          } finally {
            this._applying--;
          }
        },
        // هل إحنا حاليا جوه كود داخلى؟
        get isInternal() {
          return this._applying > 0;
        },
        // رجّع الـ object الأصلى لو اتلف فى Proxy (مفيد فى المقارنات ===)
        unwrap: function(obj) {
          return (obj && obj[PICASSO_RAW]) || obj;
        },
        _toDashed: function(prop) {
          if (prop === "cssFloat") return "float";
          if (prop.startsWith("--")) return prop;
          return prop.replace(/[A-Z]/g, (c) => "-" + c.toLowerCase());
        },
        _toCamel: function(prop) {
          if (prop === "float") return "cssFloat";
          if (prop.startsWith("--")) return prop;
          return prop.replace(/-([a-z])/g, (_, c) => c.toUpperCase());
        },
        // قراءة قيمة (بما فيها !important) بطريقة موحدة
        _readStyle: function(style, prop) {
          if (prop === "cssText") return style.cssText;
          const name = this._toDashed(prop);
          const val = style.getPropertyValue(name);
          return val && style.getPropertyPriority(name) ? val + " !important" : val;
        },
        // كتابة قيمة (بما فيها !important والـ custom properties)
        _writeStyle: function(style, prop, val) {
          if (prop === "cssText") { style.cssText = val; return; }
          const name = this._toDashed(prop);
          const m = typeof val === "string" ? val.match(/^(.*?)\s*!important\s*$/i) : null;
          if (m) {
            style.setProperty(name, m[1], "important");
          } else if (name.startsWith("--")) {
            if (val === "" || val == null) style.removeProperty(name);
            else style.setProperty(name, val);
          } else {
            style[prop] = val;
          }
        },
        // إضافة HistoryNode جديدة بنفس تأثيرات record() على الـ index والـ UI
        _commit: function(data) {
          data.timestamp = new Date().toISOString();
          this.Stack.push(new HistoryNode(data));
          const len = document.querySelector("#available-length");
          if (len) len.innerText = this.Stack.length;
          const tl = document.querySelector("#Motion-Graphics-timeline");
          if (tl) tl.max = this.Stack.length - 1;
          this.index = this.Stack.length;
          this.current = this.Stack[this.index];
        },
        // تسجيل تغيير حصل على rule.style بشكل مباشر من المطور
        _recordStyleChange: function(rule, prop, oldValue, value) {
          if (oldValue === value) return; // مفيش تغيير فعلى (أو المتصفح رفض القيمة)
          this._commit({
            type: "CSSOM",
            source: "History-Direct",
            trigger: "afterChange",
            rule: rule,
            prop: prop,
            value: value,
            oldValue: oldValue,
            propType: this._propType(prop),
            event: null
          });
          console.log(`Picasso History [CSSOM] ~ Direct edit recorded ${prop}: ${oldValue} -> ${value}`);
        },
        _propType: function(prop) {
          let props = null;
          try { props = window.parent.CSSEditor.CSSProps; } catch (e) {}
          if (!props) { try { props = window.CSSEditor.CSSProps; } catch (e) {} }
          const meta = props && props[prop];
          return meta ? meta.type : undefined;
        },
        // ================= Cascade: تعديل جوه الـ onChange callback بيرد بـ callback تانى =================
        // القيمة الافتراضية العامة. ممكن كل callback يغيّرها لنفسه: onChange(e => { e.cascadeEnabled = false; })
        cascadeEnabled: true,
        maxCascadeDepth: 8,   // سقف التسلسل لو callbacks بيستدعوا بعض
        _cbStack: [],         // الـ callbacks (الأصلية) اللى شغالة حاليا
        _callbacks: function() {
          return window.functionsList || (window.parent && window.parent.functionsList);
        },
        // بيلف callback مسجل بحيث الحدث إلى بيستقبله يكون rule مراقَب
        _wrapCallback: function(fn) {
          if (typeof fn !== "function" || PICASSO_ORIG_OF.has(fn)) return fn;
          let w = PICASSO_WRAPPERS.get(fn);
          if (w) return w;
          const history = this;
          w = function(e) {
            history._cbStack.push(fn);
            try {
              return fn.call(this, history._wrapEvent(e));
            } finally {
              history._cbStack.pop();
            }
          };
          PICASSO_WRAPPERS.set(fn, w);
          PICASSO_ORIG_OF.set(w, fn);
          return w;
        },
        // الحدث إلى بيوصل للـ callback: e.rule بقى rule مراقَب فى وضع cascade
        _wrapEvent: function(e) {
          if (!e || typeof e !== "object") return e;
          const raw = e[PICASSO_RAW] || e;
          const r = raw.rule;
          if (!r || typeof r !== "object" || !r.style || typeof r.style.setProperty !== "function") return e;
          const history = this;
          let watched = null;
          // e.cascadeEnabled: خاص بالـ callback ده وبالحدث ده بس (مش بيتخزن على الحدث الأصلى).
          // لو متحددش بياخد القيمة العامة Picasso.history.cascadeEnabled
          let local;
          const ctx = {
            event: raw,
            enabled: () => (local === undefined ? history.cascadeEnabled : local)
          };
          return new Proxy(raw, {
            get: (t, p) => {
              if (p === PICASSO_RAW) return t;
              if (p === "cascadeEnabled") return ctx.enabled();
              if (p === "rule") return watched || (watched = history._watchRule(t.rule, ctx));
              return Reflect.get(t, p, t);
            },
            set: (t, p, v) => {
              if (p === "cascadeEnabled") { local = !!v; return true; }
              if (p === "rule") watched = null;
              return Reflect.set(t, p, v, t);
            }
          });
        },
        // تعديل حصل جوه callback => ابعت حدث CSSOM جديد لباقى الـ callbacks.
        // التسليم بيتم بعد ما الـ dispatch الحالى يخلص (microtask)، عشان كل callback (والـ recorder)
        // يشوف الحدث الأصلى الأول وبعدين الـ cascade، بنفس ترتيب السببية.
        _cascade: function(parent, rule, prop, oldValue, value) {
          if (oldValue === value) return;
          const depth = (parent.depth || 0) + 1;
          if (depth > this.maxCascadeDepth) {
            console.warn(`Picasso History [cascade] ~ stopped at depth ${this.maxCascadeDepth} (${prop})`);
            return;
          }
          const list = this._callbacks();
          if (!Array.isArray(list)) return;
          // اللى اتنادوا فى السلسلة دى + اللى شغال دلوقتى مش بيتنادوا تانى (بيمنع الدوران)
          const exclude = new Set(PICASSO_EXCLUDE.get(parent) || []);
          this._cbStack.forEach((f) => exclude.add(f));
          const ev = {
            type: "CSSOM",
            source: "callback",
            target: parent.target,
            cssRules: parent.cssRules,
            prop: prop,
            value: value,
            oldValue: oldValue,
            rule: rule,
            event: parent.event,
            trigger: parent.trigger || "unknown",
            propType: this._propType(prop),
            parentEvent: parent,
            depth: depth
          };
          PICASSO_EXCLUDE.set(ev, exclude);
          const deliver = () => {
            for (const fn of list.slice()) {
              if (typeof fn !== "function") continue;
              if (exclude.has(PICASSO_ORIG_OF.get(fn) || fn)) continue;
              try {
                fn(ev);
              } catch (err) {
                console.error("Picasso History [cascade] ~ callback failed", err);
              }
            }
          };
          if (typeof queueMicrotask === "function") queueMicrotask(deliver);
          else Promise.resolve().then(deliver);
        },
        // بيفعّل اللف على functionsList (الـ callbacks الحالية + أى push جاى)
        _installCascade: function() {
          const list = this._callbacks();
          if (!Array.isArray(list)) return false;
          if (list[PICASSO_PATCHED]) return true;
          const history = this;
          for (let i = 0; i < list.length; i++) list[i] = history._wrapCallback(list[i]);
          const nativePush = Array.prototype.push;
          Object.defineProperty(list, "push", {
            configurable: true,
            writable: true,
            enumerable: false,
            value: function(...fns) {
              for (const fn of fns) {
                const w = history._wrapCallback(fn);
                if (!this.includes(w)) nativePush.call(this, w);
              }
              return this.length;
            }
          });
          Object.defineProperty(list, PICASSO_PATCHED, { value: true });
          return true;
        },
        // بيلف الـ rule (و الـ style بتاعه) فى Proxy.
        // بدون ctx: تعديل خارجى (من المطور) => HistoryNode جديدة
        // مع ctx:   تعديل جوه onChange callback => cascade (callback تانى يرد)
        _watchRule: function(rule, ctx) {
          if (!rule || typeof rule !== "object") return rule;
          if (rule[PICASSO_RAW]) {
            if (!ctx) return rule;
            rule = rule[PICASSO_RAW];
          }
          if (!rule.style || typeof rule.style.setProperty !== "function") return rule;
          if (!ctx) {
            const cached = PICASSO_WATCHED.get(rule);
            if (cached) return cached;
          }
          const history = this;
          const emit = ctx
            ? (prop, before, after) => { if (ctx.enabled()) history._cascade(ctx.event, rule, prop, before, after); }
            : (prop, before, after) => history._recordStyleChange(rule, prop, before, after);
          const rawStyle = rule.style;
          const styleProxy = new Proxy(rawStyle, {
            get: (t, p) => {
              if (p === PICASSO_RAW) return t;
              if (p === "setProperty") {
                return (name, value, priority) => {
                  const prop = history._toCamel(name);
                  const before = history._readStyle(t, prop);
                  t.setProperty(name, value, priority || "");
                  if (!history.isInternal) {
                    emit(prop, before, history._readStyle(t, prop));
                  }
                };
              }
              if (p === "removeProperty") {
                return (name) => {
                  const prop = history._toCamel(name);
                  const before = history._readStyle(t, prop);
                  const ret = t.removeProperty(name);
                  if (!history.isInternal) {
                    emit(prop, before, history._readStyle(t, prop));
                  }
                  return ret;
                };
              }
              const v = Reflect.get(t, p, t);
              return typeof v === "function" ? v.bind(t) : v;
            },
            set: (t, p, v) => {
              const trackable = typeof p === "string" && p in t && p !== "length" && p !== "parentRule";
              if (!trackable || history.isInternal) return Reflect.set(t, p, v, t);
              const before = history._readStyle(t, p);
              const ok = Reflect.set(t, p, v, t);
              emit(p, before, history._readStyle(t, p));
              return ok;
            }
          });
          const ruleProxy = new Proxy(rule, {
            get: (t, p) => {
              if (p === PICASSO_RAW) return t;
              if (p === "style") return styleProxy;
              const v = Reflect.get(t, p, t);
              return typeof v === "function" ? v.bind(t) : v;
            },
            set: (t, p, v) => Reflect.set(t, p, v, t)
          });
          if (!ctx) PICASSO_WATCHED.set(rule, ruleProxy);
          return ruleProxy;
        },
        record: function() {
       if(typeof onChange === "function") {
            this._installCascade();
            onChange((e)=>{
            e.timestamp = new Date().toISOString();
            if(e.type == "CSSOM") {
              if(e.subTrigger == "insert-finished") {
                this.Stack.push(new HistoryNode(e));
              }
         if(e.prop) {
         if(e.trigger == "beforeChange") {
                    this.Stack.push(new HistoryNode(e));
                  }
            if(e.trigger == "afterChange") {
                    this.Stack.push(new HistoryNode(e));
                  }
              }
           }
            if(e.type == "DOM") {
             if(e.trigger == "property") {
               this.Stack.push(new HistoryNode(e));
             }
           }
            if(e.type == "DOM" || e.type == "CSSOM") {
             document.querySelector("#available-length").innerText = this.Stack.length;
             document.querySelector("#Motion-Graphics-timeline").max = this.Stack.length - 1;
           }
            this.index = this.Stack.length;
            this.current = this.Stack[this.index];
          });
          console.log("Recording", this);
          } else {
            console.error("❌: onChange not ready");
          }
        },
        apply: function() {
          // أى تعديل بينفذه النظام هنا (undo/redo) مش بيتسجل كـ HistoryNode جديدة
          return this.silent(this._apply);
        },
        _apply: function() {
          if(this.current) {
          if(this.current.type == "CSSOM") {
          if(this.current.propType) {
                console.log("prop",this.method,this.current);
                var val = this.method == "undo" ? this.current.oldValue : this.current.value;
                this._writeStyle(this.current.rule.style, this.current.prop, val);
          console.log(`Picasso History [CSSOM] ~ Update Property ${this.current.prop}: ${val}`);
              }
          if(this.current.type == "CSSOM" && this.current.subTrigger == "insert-finished") {
             if(this.method == "undo") {
                Entrypoint.FBallTarget = this.current.node;
                if(this.current.cssRules) {
                  for (const R of this.current.cssRules) {
                    if(R && !R.rule.parentRule && R.rule.parentStyleSheet) {
                      R.rule.parentStyleSheet.deleteRule(Paint.indexOf(R.rule));
                      console.log("[CSSOM] ~ Delete Rule",R.rule);
                    }
                    if(R && R.rule.parentRule) {
                      R.rule.parentRule.deleteRule(Paint.indexOf(R.rule));
                      console.log("[CSSOM] ~ Delete Rule",R.rule);
                    }
                  }
                }
                if(Entrypoint.FBallTarget.isConnected) {
                 Entrypoint.FBallTarget.parentElement.removeChild(Entrypoint.FBallTarget);
                 console.log(`Picasso History [DOM] ~ Remove Node`);
                 console.log(`Picasso History [CSSOM] ~ Remove Rules Collection`);
                }
              }
             if(this.method == "redo") {
             if(!this.current.node.isConnected && this.current.parent) {
               this.current.parent.appendChild(this.current.node);
               console.log(`Picasso History [DOM] ~ Node Rollback`);
             }
             for (rule of this.current.cssRules) {
               var old = rule.rule;
               rule.rule = Paint.addRule(rule.styleSheet,
                  rule.cssText);
                  var targets = this.Stack.filter(part => this.unwrap(part.rule) == old);
                  if(targets.length >= 1) {
                    targets.forEach((r)=>{
                      if(r) {
                        r.rule = rule.rule;
                      }
                    });
                  }
                  console.log(`Picasso History [CSSOM] ~ Rollback & Update`);
            }
         console.log(`Picasso History [CSSOM] ~ Rules Collection Rollback`);
            }
          }
          if(this.current.rule && ! window.parent.CSSEditor.CSSProps[this.current.prop]) {
           if(this.method == "undo") {
             this._writeStyle(this.current.rule.style, this.current.prop, this.current.oldValue);
           }
           if(this.method == "redo") {
             this._writeStyle(this.current.rule.style, this.current.prop, this.current.value);
           }
          }
        }
          if(this.current && this.current.type == "DOM") {
          if(this.method == "undo") {
            if(this.current.trigger == "property") {
              this.current.target[this.current.prop] = this.current.value;
              console.log(`Picasso History [DOM] ~ Update Property ${this.current.prop}: ${this.current.value}`);
            }
            if(this.current.trigger == "property" && this.current.subTrigger == "del") {
              if(!`${this.current.prop}` in window[this.current.target.constructor.name]) {
                this.current.target.setAttribute(
                this.current.prop,
                this.current.value);
              } else {
                this.current.target[this.current.prop] = this.current.value;
              }
              console.log(`Picasso History [DOM] ~ Update Property ${this.current.prop}: ${this.current.value}`);
            }
          }
          if(this.method == "redo") {
            if(this.current.trigger == "property") {
              this.current.target[this.current.prop] = this.current.value;
              console.log(`Picasso History [DOM] ~ Update Property ${this.current.prop}: ${this.current.value}`);
            }
            if(this.current.trigger == "property" && this.current.subTrigger == "del") {
              this.current.target.setAttribute(this.current.prop,this.current.value);
              console.log(`Picasso History [DOM] ~ restore Property ${this.current.prop}: ${this.current.value}`);
            }
          }
        }
          }
        },
        undo: function() {
        this.method = "undo";
        this.current = this.Stack[this.index];
     if(this.index > 0) {
        this.index--;
       }
        this.apply();
        },
        redo: function() {
        this.method = "redo";
        this.current = this.Stack[this.index];
   if(this.index < this.Stack.length - 1) {
        this.index++;
        }
        this.apply();
     }
  }
};

window.addEventListener('load', () => {
    Picasso.history.record();
});

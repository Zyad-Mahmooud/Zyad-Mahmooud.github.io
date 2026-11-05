class HistoryNode {
  constructor(obj) {
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
var Picasso = {
    history: {
        Stack: [],
        index: 0,
        current: null,
        method: null,
        record: function() {
       if(typeof onChange === "function") {
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
          if(this.current) {
          if(this.current.type == "CSSOM") {
          if(this.current.propType) {
                console.log("prop",this.method,this.current);
                var val = this.method == "undo" ? this.current.oldValue : this.current.value;
                this.current.rule.style[this.current.prop] = val;
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
                  var targets = this.Stack.filter(part => part.rule == old);
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
             this.current.rule.style[this.current.prop] = this.current.oldValue;
           }
           if(this.method == "redo") {
             this.current.rule.style[this.current.prop] = this.current.value;
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
             this.apply();
          if(this.index > 0) {
             this.index--;
          }
          this.apply();
        },
        redo: function() {
        this.method = "redo";
        this.current = this.Stack[this.index];
        this.apply();
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

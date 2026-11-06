window.FBallTarget = null;

function Parse(html) {
  const vDOM = new DOMParser();
  const page = vDOM.parseFromString(html, "text/html");
  return page.querySelector("body > *");
}

window.actions = {
      del: function(element) {
        var Trash = [];
        if(element && element.localName != "body" && element.localName != "html") {
          var { parentElement, parentNode, parent } = element;
          for (rule of Paint.getMatched(element)) {
            if(rule) {
              Trash.push(rule);
            }
          }
          var childrens = element.querySelectorAll("*");
        if(childrens.length >= 1) {
            for (children of childrens) {
              if(children) {
                for (rule of Paint.getMatched(children)) {
            if(rule) {
              Trash.push(rule);
            }
          }
              }
            }
          }
          for (pice of Trash) {
          Notification({
        type: "CSSOM",
        trigger: "del",
        cssText: pice.rule.cssText,
        parentStyleSheet: pice.rule.parentStyleSheet,
        parentRule: pice.rule.parentRule,
        index: Paint.indexOf(pice.rule)
      });
          pice.styleSheet.deleteRule(Paint.indexOf(pice.rule));
        }
        Notification({
        type: "CSSOM",
        trigger: "del",
        subTrigger: "insert-finished",
        cssRules: Trash,
        element,
        node: element,
        parentElement,
        parentNode,
        parent
      });
      element.parentElement.removeChild(element);
          Notification({
                type: "DOM",
                trigger: "del",
                element,
                parentElement,
                parentNode,
                parent,
                deletedRules: Trash
              });
        }
      },
      copy: function(element) {
        if(
          element.tagName == "BODY" ||
          element.tagName == "HTML"
        ) return;
      var Copy = Paint.deepCloneNodeWithStyles(element);
      window.Copied = Copy;
    },
      paste: function(element) {
      var addedNode = Paint.deepCloneNodeWithStyles(window.Copied.cloneNode(true),FBallTarget);
      FBallTarget.appendChild(addedNode);
      Notification({
               type: "DOM",
               trigger: "addNode",
               subTrigger: "paste",
               target: element,
               addedNode,
             });
             Notification({
               type: "CSSOM",
               trigger: "paste"
             });
      },
      style: function() {
      if(typeof window.parent.showCSSOM === "function") {
          window.parent.showCSSOM();
        }
      }
      };
function toggleBall(button, container) {
  if (container.style.width !== "150px") {
    container.style.width = "150px";
    container.style.height = "150px";
    container.querySelector(".--ball--items").style.display = "block";
  } else {
    container.style.width = "50px";
    container.style.height = "50px";
    container.querySelector(".--ball--items").style.display = "none";
  }
}

function initBall() {
  var e = document.querySelector(`[data-function="zero"]`);
  if(e){
    e.remove();
  }
  var code = `<div data-function="zero" class="picasso-ball-menu">
    <button data-function="main" class="Openpicasso-ball-menu-this" id="OPENP">P</button>
    <div data-function="notice" class="--ball--items">
      <button data-function="del" class="btn btn-1">Del</button>
      <button data-function="copy" class="btn btn-2">Copy</button>
      <button data-function="style" class="btn btn-3">Style</button>
      <button data-function="" class="btn btn-4"></button>
      <button data-function="paste" class="btn btn-5">Paste</button>
    </div>
  </div>`;
  var DOM = Parse(code);
  var shadow = DOM;
  shadow.innerHTML = code;
  shadow.innerHTML += `<style id="picasso-ball-styles">
  button[data-function] {
    background-image: linear-gradient(gold, orange,gold);
    border: none;
    border-radius: 15px;
    width: 90px;
    height: 40px;
  }
  .picasso-ball-menu {
    background-color: #1a1a1a;
    width: 50px;
    height: 50px;
    border-radius: 100px;
    display: flex;
    flex-direction: row;
    justify-content: center;
	  justify-items: center;
	  align-items: center;
  	align-content: center;
  	transition: 500ms , margin-top 0s, margin-left 0s , left 0s , top 0s;
  	user-select: none;
  	position: fixed;
  	z-index: 99999990000000999999999;
  }
  .picasso-ball-menu > .Openpicasso-ball-menu-this {
    background-image: linear-gradient(gold, orange,gold);border-radius: 100px;font-family: cursive;position: absolute;font-size: 16px;font-weight: 800;border: none;width: 40px;height: 40px;
  }
  .picasso-ball-menu > .Openpicasso-ball-menu-this:active {
    font-weight: bold;
  }
  .--ball--items {
    display: none;
  }
  .--ball--items > button {
    border-radius: 100px;
    border: none;
    width: 40px;
    height: 40px;
    transition: 100ms;
  }
  .--ball--items > button:active {
    font-size: 12px;
    font-style: italic;
    font-weight: bold;
  }
  .--ball--items > .btn {
    background-image: linear-gradient(gold, orange,gold);
    position: absolute;
    text-align: center;
  }
  .--ball--items > .btn-1 {
    margin-left: -57px;
    margin-top: -50px;
  }
  .--ball--items > .btn-2 {
    margin-left: -62px;
    margin-top: 4px;
  }
  .--ball--items > .btn-3 {
    margin-top: 26px;
    margin-left: -15px;
  }
  .--ball--items > .btn-4 {
    margin-left: 26px;
    margin-top: -6px;
    text-align: left;
  }
  .--ball--items > .btn-5 {
    margin-left: 5px;
    margin-top: -62px;
  }
</style>`;
  if(!document.querySelector(`[data-function="zero"]`)){
    document.body.appendChild(DOM);
  }
  const button = document.querySelector(".Openpicasso-ball-menu-this");
  const container = document.querySelector(".picasso-ball-menu");
  if (!button || !container) return;

  container.removeAttribute("style");

  // Toggle menu
  button.onclick = () => toggleBall(button, container);
  document.body.addEventListener("dblclick",()=>{
    container.style.top = 0;
    container.style.left = 20;
  });
  // Touch move
  button.addEventListener("touchmove", e => {
    const touch = e.touches[0];
    const containerRect = container.getBoundingClientRect();
    const screenWidth = window.innerWidth;
    const screenHeight = window.innerHeight;

    // حساب الإحداثيات مع القيود
    let left = touch.clientX;
    let top = touch.clientY;

    // منع الخروج عن العرض
    if (left < 0) left = 0;
    if (left + containerRect.width > screenWidth) left = screenWidth - containerRect.width;

    // منع الخروج عن الطول
    if (top < 0) top = 0;
    if (top + containerRect.height > screenHeight) top = screenHeight - containerRect.height;

    container.style.left = `${left}px`;
    container.style.top = `${top}px`;
});

  // Update FBallTarget
document.body.addEventListener("click", e => {
if (!e.target.hasAttribute("data-function")) {
        FBallTarget = e.target;
      }
    });
  document.body.addEventListener("input", e => {
if (!e.target.hasAttribute("data-function")) {
        FBallTarget = e.target;
      }
    });

  // Delegated listener for all ball buttons
  container.addEventListener("click", e => {
      const btn = e.target.closest("button[data-function]");
      if (!btn || !FBallTarget) return;

      const action = btn.getAttribute("data-function");
      if(!FBallTarget.hasAttribute("data-function")) {
        if (actions[action]) actions[action](FBallTarget);
      }
    });
}
console.log("if you ever lost this ball simply double click anywhere 😉");
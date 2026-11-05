function insertController(obj) {
    let container = document.querySelector(`#${obj.section}`);
    if(!container) {
          insertSection({
            title: obj.section
          });
         container = document.querySelector(`#${obj.section}`);
        }
    
    let w = document.createElement("div");
    w.classList.add("inserted-controller"); // ✅ أضف الـ class للعنصر نفسه
    
    var wrapper = w.attachShadow({mode: "open"});
    
    let styling = document.createElement("link");
    styling.rel = "stylesheet";
    styling.href = "./custom-elements.css";
    var styling2 = document.createElement("style");
    styling2.innerHTML = obj.css;
    var styling3 = document.createElement("link");
    styling3.rel = "stylesheet";
    styling3.href = "./basic.css";
    wrapper.appendChild(styling);
    wrapper.appendChild(styling2);
    wrapper.appendChild(styling3);
    wrapper.innerHTML += obj.html;
    wrapper.querySelectorAll("[range-input=\"true\"]").forEach((RI)=>{
      if(RI) {
        RI.outerHTML = `
        <range-input></range-input>
        `;
      }
    });
    container.appendChild(w);
  if(typeof obj.onLoad === "function") {
        obj.onLoad(wrapper);
    }
  if(typeof obj.onChange === "function") {
        let controls = wrapper.querySelectorAll("*");
        controls.forEach(ctrl => {
      ctrl.addEventListener("input", () => {
          obj.onChange(wrapper,"input");
        });
      ctrl.addEventListener("change", () => {
          obj.onChange(wrapper,"change");
        });
 ctrl.addEventListener("pointerdown", () => {
        obj.onChange(wrapper,"beforeChange");
        });
    });
    
    
    
 let observer = new MutationObserver(() => {
      if(typeof obj.onChange === "function"){
            obj.onChange(wrapper,"input");
        }
    });
    
    observer.observe(wrapper, {
        attributes: true,
        childList: true,
        subtree: true,
        characterData: true
    });
}
}
window.parent.insertController = insertController;
// for input type range tags
window.picker = new CodeMirrorColorPicker.create({
  position: 'fixed',
  type: "macos",
  color: 'blue',
  outputFormat: 'rgba',
  hideDelay: 0,
  onChange: function (c) {
    //startColoring(c); // دى بترجع اللون
  }
});
function display(el) {
var carpet = el.parentElement.parentElement.querySelector('.carpet');
(carpet.style.height == "" || carpet.style.height == "0px") ? carpet.style.height = "auto" : carpet.style.height = "0px";
}
function toValue(obj) {
  if(window.parent.Objects) {
      if(obj && obj.trigger) {
        window.parent.Objects.trigger = obj.trigger;
      }
      window.parent.Objects.targetRule[obj.prop] = obj.value;
    } else {
      console.log("editor is disconnected");
    }
}

  function uploadThatFile(element) {
    window.parent.Objects.targetRule[element.getAttribute("prop")] = `url(${window.URL.createObjectURL(element.files[0])})`;
    element.parentElement.querySelector("#filename").innerText=element.files[0].name;
  }
  function returnClick(element) {
    element.parentElement.querySelector(`input[type="file"]`).click();
  }
  function removeBG(element) {
    document.body.style.removeProperty("background-image");
    element.parentElement.querySelector("#filename").innerText="no file is selected";
  }
// for select tags
function setProp(element) {
if(window.parent.Objects) {
	let prop = element.getAttribute("prop");
	let value = element.value;
    window.parent.Objects.targetRule[prop] = value;
  window.parent.Objects.trigger = "afterChange";
   } else {
      console.log("editor is disconnected");
    }
}
function config() {

}
function resetProperty(prop,container) {
	if(window.parent.Objects) {
		window.parent.Objects.targetRule.removeProperty(prop);
	} else {
      console.log("editor is disconnected");
    }
	container.parentElement.parentElement.querySelector("Selector").removeAttribute("style");
}

function setPropertyValue(h) {
if(window.parent.Objects) {
  window.parent.Objects.trigger = "afterChange";
  window.parent.Objects.targetRule[h.getAttribute("prop")] = `"${h.value}"`;
  }
}

function initDefaults(e) {
  if(window.parent.Objects) {
  window.parent.Objects.trigger = "beforeChange";
  if(CSS.supports(e.getAttribute("prop").replaceAll(/([A-Z])/g,(_,Litter)=>{
    return `-${Litter.toLowerCase()}`;
  }),e.value)) {
    window.parent.Objects.targetRule[e.getAttribute("prop")] = `${e.value}`;
  } else {
    window.parent.Objects.targetRule[e.getAttribute("prop")] = `"${e.value}"`;
  }
  }
}
function initColorDefaults(e) {
  alert();

}
function showColoring(e) {
  if(window.parent.Objects) {
      window.parent.Objects.trigger = "beforeChange";
  }
  window.targetColorizer = e.target;
      const rect = targetColorizer.getBoundingClientRect();
      let elementColor = "";
      picker.show(
        {
          left: e.x,
          top: e.y,
          hideDelay: 0
        },
        getComputedStyle(e.target).backgroundColor,
        function onChange(newColor) {
        window.targetColorizer.style.backgroundColor = newColor;
        window.targetColorizer.setAttribute("data-color",newColor);
        if(window.parent.Objects) {
           window.parent.Objects.trigger = "whileChange";
           window.parent.Objects.targetRule[window.targetColorizer.getAttribute("prop")] = window.targetColorizer.style.backgroundColor;
          }
        },
        function onHide(newColor) {
          window.targetColorizer.style.backgroundColor = newColor;
        window.targetColorizer.setAttribute("data-color",newColor);
        if(window.parent.Objects) {
           window.parent.Objects.trigger = "afterChange";
           window.parent.Objects.targetRule[window.targetColorizer.getAttribute("prop")] = window.targetColorizer.style.backgroundColor;
          }
        }
      );
}
let found = 0; 
let notFound = 0;
let output = "";
function createApp() {
Object.keys(window.CSSProps).forEach((prop)=>{
       let property = window.CSSProps[prop];
        prop = prop.replaceAll("_","");
        var container = document.querySelector(`#${property.group}`);
        if(!container) {
          insertSection({
            title: property.group
          });
         container = document.querySelector(`#${property.group}`);
        }
        let Schema = {
  range:`<range-input min="${property.min || 0}" max="${property.max || 1000}" text="width" prop="${prop}" title="${prop}" oninput="toValue({ value: this.value, prop: '${prop}' })" unit="${(function (){
    if(property.unit == "") {
      return "";
    } else if(property.unit) {
      return property.unit;
    } else if(!property.unit) {
      return "px";
    }
  })()}"></range-input>`,
  select:'<select onchange="setProp(this)" class="picasso-select" onfocus="initDefaults(this)"></select>',
  color:`<div class="ColorSelector"></div>`,
  file:`<div class="file">
  <input prop="backgroundImage" onchange="uploadThatFile(this)" type="file" id="upload-file-for-css-editor"/>
  <button onclick="returnClick(this);" class="SelectFile-Btn">Select File</button>
  <button prop="backgroundImage" onclick="removeBG(this)" class="RemoveFile-Btn">
    <p>&times;</p>
  </button>
  <p id="filename">no file is selected</p>
</div>`,
text: `<input type="text" oninput="setPropertyValue(this)" onclick="setPropertyValue(this)" onfocus="initDefaults(this)" class="text-input">`
};
        let HTML = Schema[property.type];
        let Parser = new DOMParser();
        let DOM = Parser.parseFromString(HTML,"text/html");
        output = DOM.body.querySelector("*");
        if(output) {
        	if(output.tagName == "DIV" && output.className == "ColorSelector") {
        	output = document.createElement("div");
        	let element = document.createElement("div");
        	element.className = "ColorSelectorContainer";
        	element.innerHTML = `
        	<div prop="${prop}" class="ColorSelector" onclick="showColoring(event);"></div>
        	<p class="ColorSelector-title golden-text" style="display: inline!important; position: relative;important;">${property.title || prop.replaceAll(/([A-Z])/g,(_,p)=>{
        	  return " "+p.toLowerCase();
        	})}</p>
        	<p style="margin-left:38px; font-size:10px; margin-top:25px;"><a onclick="event.preventDefault();resetProperty(camelToKebab('${prop}'),this)" href="#">Reset</a></p>
        	`;
        	var CP = element.querySelector(".ColorSelector");
        	CP.addEventListener("click",(e)=>{
        	  if(window.parent.Objects) {
        	    window.parent.Objects.targetRule[CP.getAttribute("prop")] = CP.style.backgroundColor;
        	  window.parent.Objects.trigger = "beforeChange";
        	  }
        	});
        	output.appendChild(element);
        }
        if(output.tagName != "SELECT") {
     output.setAttribute("prop",prop);
     output.setAttribute("title",property.title || prop);
     output.setAttribute("propTitle",prop.title || prop);
     container?.appendChild(output);
        } else {
            property.options.forEach((d)=>{
                let opt = new Option(d,d);
                if(output) {
                  output.appendChild(opt);
                  output.setAttribute("prop",prop);
                  output.setAttribute("propTitle",prop);
                }
            });
            let wrapper = document.createElement("div");
            wrapper.className="Lolos";
            let txt = document.createElement("label");
            txt.innerText = property.title || prop.replaceAll(/([A-Z])/g,(_,p)=>{
        	  return " "+p.toLowerCase();
        	});
            txt.className = "prop-propTitle";
            output.addEventListener("change",(e)=>{
                toValue({
                    value:e.target.value,
                    prop:e.target.getAttribute("prop")
                });
            });
            wrapper?.appendChild(txt);
            wrapper?.appendChild(output);
            container?.appendChild(wrapper);
        }
        if(output.tagName == "INPUT") {
          output.placeholder = prop;
        }
        }
    });
}
function registeProps(object) {
Object.keys(object).forEach((prop)=>{
        let property = object[prop];
        var container = document.querySelector(`#${property.group}`);
        if(!container) {
          insertSection({
            title: property.group
          });
         container = document.querySelector(`#${property.group}`);
        }
        let Schema = {
  range:`<div range-input="true" min="${property.min || 0}" max="${property.max || 1000}" text="width" prop="width" oninput="toValue(this.value)" unit="${(function (){
    if(property.unit == "") {
      return "";
    } else if(property.unit) {
      return property.unit;
    } else if(!property.unit) {
      return "px";
    }
  })()}"></div>`,
  select:'<select onclick="setProp(this)"  onchange="setProp(this)" class="picasso-select"></select>',
  color:`<div class="ColorSelector"></div>`,
  file:`<div class="file">
  <input prop="backgroundImage" onchange="uploadThatFile(this)" type="file" id="upload-file-for-css-editor"/>
  <button onclick="returnClick(this);" class="SelectFile-Btn">Select File</button>
  <button prop="backgroundImage" onclick="removeBG(this)" class="RemoveFile-Btn">
    <p>&times;</p>
  </button>
  <p id="filename">no file is selected</p>
</div>`,
text: `<input type="text" oninput="setPropertyValue(this)" onclick="setPropertyValue(this)" class="text-input">`
};
        if(!container) {
        	notFound++;
            //console.log(`#${property.group} container is not found`);
            insertSection({
              title: property.group
            })
        } else {
        	found++;
        	//console.log(`#${property.group} container is found`);
        }
        let HTML = Schema[property.type];
        let Parser = new DOMParser();
        let DOM = Parser.parseFromString(HTML,"text/html");
        output = DOM.body.querySelector("*");
        if(output) {
        	if(output.tagName == "DIV" && output.className == "ColorSelector") {
        	output = document.createElement("div");
        	let element = document.createElement("div");
        	element.className = "ColorSelectorContainer";
        	element.innerHTML = `
        	<div prop="${prop}" class="ColorSelector"></div>
        	<p class="ColorSelector-title golden-text">${prop}</p>
        	<p style="margin-left:38px; font-size:10px; margin-top:25px;"><a onclick="event.preventDefault();resetProperty(camelToKebab('${prop}'),this)" href="#">Reset</a></p>
        	`;
        	output.appendChild(element);
        }
        if(output.tagName != "SELECT") {
     output.setAttribute("prop",prop);
     output.setAttribute("title",prop);
     output.setAttribute("propTitle",prop);
     container?.appendChild(output);
        } else {
            property.options.forEach((d)=>{
                let opt = new Option(d,d);
                if(output) {
                  output.appendChild(opt);
                  output.setAttribute("prop",prop);
                  output.setAttribute("propTitle",prop);
                }
            });
            let wrapper = document.createElement("div");
            wrapper.className="Lolos";
            let txt = document.createElement("label");
            txt.innerText = prop;
            txt.className = "prop-propTitle";
            output.addEventListener("change",(e)=>{
                toValue({
                    value:e.target.value,
                    prop:e.target.getAttribute("prop")
                });
            });
            wrapper?.appendChild(txt);
            wrapper?.appendChild(output);
            container?.appendChild(wrapper);
        }
        if(output.tagName == "INPUT") {
          output.placeholder = prop;
        }
        }
    });
    addElm();
}
window.parent.registeProps = registeProps;
window.addEventListener("load", () => {
createApp();
});


window.onerror = function (message, source, lineno, colno, error) {
  console.log(Object({
  	message,
  	source,
  	lineno,
  	colno,
  	error: error.message,
  }));
};
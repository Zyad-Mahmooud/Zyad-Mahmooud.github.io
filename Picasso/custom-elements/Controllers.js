function initControllers() {
insertController({
  section: "Shading",
  html: `
    <div class="DropShadow-app">
      <h3>drop-shadow</h3>
      <range-input unit="px" range-input="true" min="0" max="1000" title="offsetX" data-prop="offsetX"></range-input>
      <range-input unit="px" range-input="true" min="0" max="1000" title="offsetY" data-prop="offsetY"></range-input>
      <range-input unit="px" range-input="true" min="0" max="200" title="blurRadius" data-prop="blurRadius"></range-input>
      <br>
      <b>Color:</b>
      <div data-prop="shadowColor" class="ColorSelector"></div><br>
      <button class="deDropShadow">&times;</button>
    </div>
  `,
  css: `
    .DropShadow-app {
      color: #E6E1DC;
      background-color: #202020;
      margin-top: 5px;
      width: 89%;
      padding: 10px;
      border-radius: 5px;
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      gap: 8px;
    }
    .deDropShadow {
      background: linear-gradient(gold,orange,gold);
      border: none;
      width: 30px;
      font-size: 16px;
      height: 30px;
      border-radius: 8px;
    }
  `,
  onChange: function(element) {
    // قراءة القيم من السلايدرز
    const values = element.querySelectorAll('input[placeholder="value"]');
    const offsetX = values[0].value || 0;
    const offsetY = values[1].value || 0;
    const blur = values[2].value || 0;

    // اللون من ColorSelector
    const colorElement = element.querySelector('div[data-prop="shadowColor"]');
    // استخدم خاصية 'style.backgroundColor' مباشرة إن وجدت، وإلا استخدم 'getComputedStyle' كخيار احتياطي
    const color = colorElement.style.backgroundColor || getComputedStyle(colorElement).backgroundColor;

    // إنشاء قيمة الفلتر مع وحدات px
    const filterValue = `drop-shadow(${offsetX} ${offsetY} ${blur} ${color})`;
    // تطبيقها على العنصر المستهدف
    if (window.parent.Objects) {
      window.parent.Objects.targetRule.filter = filterValue;
    }
  },
  onLoad: function(element) {
    element.querySelector(".deDropShadow").addEventListener("click", () => {
      if (window.parent.Objects) {
        window.parent.Objects.targetRule.removeProperty("filter");
      }
      // reset القيم
      element.querySelector('div[data-prop="shadowColor"]').removeAttribute("style");
      element.querySelectorAll('input[type="range"]').forEach(r => r.value = "0");
      element.querySelectorAll('input[placeholder="value"]').forEach(r => r.value = "0");
    });
  }
});
insertController({
  section: "Shading",
  html: `
    <div class="TextShadow-app">
      <h3>text-shadow</h3>
      <range-input unit="px" range-input="true" min="0" max="50" title="offsetX" data-prop="offsetX"></range-input>
      <range-input unit="px" range-input="true" min="0" max="50" title="offsetY" data-prop="offsetY"></range-input>
      <range-input unit="px" range-input="true" min="0" max="100" title="blurRadius" data-prop="blurRadius"></range-input>
      <br>
      <b>Color:</b>
      <div data-prop="shadowColor" class="ColorSelector"></div><br>
      <button class="deTextShadow">&times;</button>
    </div>
  `,
  css: `
    .TextShadow-app {
      color: #E6E1DC;
      background-color: #202020;
      margin-top: 5px;
      padding: 8px;
      border-radius: 5px;
      display: flex;
      flex-direction: column;
      gap: 6px;
      align-items: center;
      align-content: center;
      justify-content: center;
      justify-items: center;
      width:85%;
    }
    .deTextShadow {
      background: linear-gradient(gold, orange, gold);
      border: none;
      width: 30px;
      font-size: 16px;
      height: 30px;
      border-radius: 8px;
    }
  `,
  onLoad: function(container) {
    container.querySelector(".deTextShadow").addEventListener("click", () => {
      if (window.parent.Objects) {
        window.parent.Objects.targetRule.removeProperty("text-shadow");
      }
      container.querySelector('div[data-prop="shadowColor"]').removeAttribute("style");
      container.querySelectorAll('input[type="range"]').forEach(r => r.value = "0");
      container.querySelectorAll('input[placeholder="value"]').forEach(r => r.value = "0");
    });
  },
  onChange: function(container) {
    let inputs = container.querySelectorAll('input[placeholder="value"]');
    let offsetX = inputs[0].value || 0;
    let offsetY = inputs[1].value || 0;
    let blur = inputs[2].value || 0;
    
    // استخدم خاصية 'style.backgroundColor' مباشرة إن وجدت، وإلا استخدم 'getComputedStyle' كخيار احتياطي
    const colorElement = container.querySelector('div[data-prop="shadowColor"]');
    let color = colorElement.style.backgroundColor || getComputedStyle(colorElement).backgroundColor;

    // ✨ الإصلاح: إضافة وحدات 'px' لقيم الإزاحة والتمويه.
    let shadow = `${offsetX} ${offsetY} ${blur} ${color}`;
    if (window.parent.Objects) {
      window.parent.Objects.targetRule.textShadow = shadow;
    }
  }
});
insertController({
  section: "Shading",
  html: `
    <div class="BoxShadow-app">
      <h3>box-shadow</h3>
      <range-input unit="px" range-input="true" min="0" max="50" title="offsetX" prop="offsetX" data-prop="offsetX"></range-input>
      <range-input unit="px" range-input="true" min="0" max="50" title="offsetY" data-prop="offsetY"></range-input>
      <range-input unit="px" range-input="true" min="0" max="100" title="blurRadius" data-prop="blurRadius"></range-input>
      <br>
      <b>Color:</b>
      <div data-prop="shadowColor" class="ColorSelector"></div><br>
      <label>inset:</lable><input type="checkbox" id="insetCheck"><br>
      <button class="deBoxShadow">&times;</button>
    </div>
  `,
  css: `
    .BoxShadow-app {
      color: #E6E1DC;
      background-color: #202020;
      margin-top: 5px;
      padding: 8px;
      border-radius: 5px;
      display: flex;
      flex-direction: column;
      gap: 6px;
      align-items: center;
      align-content: center;
      justify-content: center;
      justify-items: center;
      width:85%;
    }
    .deBoxShadow {
      background: linear-gradient(gold, orange, gold);
      border: none;
      width: 30px;
      font-size: 16px;
      height: 30px;
      border-radius: 8px;
    }
  `,
  onLoad: function(container) {
    container.querySelector(".deBoxShadow").addEventListener("click", () => {
      // إزالة خاصية box-shadow عند الضغط على زر الإلغاء
      if (window.parent.Objects) {
        window.parent.Objects.targetRule.removeProperty("box-shadow");
      }
      // إعادة تعيين القيم
      container.querySelector('div[data-prop="shadowColor"]').removeAttribute("style");
      container.querySelectorAll('input[type="range"]').forEach(r => r.value = "0");
      container.querySelectorAll('input[placeholder="value"]').forEach(r => r.value = "0");
    });
  },
  onChange: function(container) {
    let inputs = container.querySelectorAll('input[placeholder="value"]');
    let offsetX = inputs[0].value || 0;
    let offsetY = inputs[1].value || 0;
    let blur = inputs[2].value || 0;
    
    // قراءة قيمة اللون
    const colorElement = container.querySelector('div[data-prop="shadowColor"]');
    let color = colorElement.style.backgroundColor || getComputedStyle(colorElement).backgroundColor;

    // إنشاء قيمة الظل مع وحدات 'px'
    let shadow = `${offsetX} ${offsetY} ${blur} ${color}${container.querySelector("#insetCheck").checked ? " inset" : ""}`;
    // تطبيقها على خاصية boxShadow
    if (window.parent.Objects) {
      window.parent.Objects.targetRule.boxShadow = shadow;
    }
  }
});
insertController({
	section:"effects",
	html:`
	<div>
	<h3>filter</h3>
		<range-input unit="px" range-input="true" min="0" max="100" value="0" title="blur" data-prop="blur" prop="blur"></range-input>
		<range-input unit="%" range-input="true" min="0" max="200" value="0" title="brightness" data-prop="brightness" prop="brightness"></range-input>
		<range-input unit="%" range-input="true" min="0" max="200" value="0" title="contrast" data-prop="contrast" prop="contrast"></range-input>
		<range-input unit="%" range-input="true" min="0" max="100" value="0" title="grayscale" data-prop="grayscale" prop="grayscale"></range-input>
		<range-input unit="%" range-input="true" min="0" max="100" value="0" title="sepia" data-prop="sepia" prop="sepia"></range-input>
		<button class="resetFilters">&times;</button>
	</div>
	`,
	css:`
	.resetFilters {
		background: linear-gradient(gold,orange,gold);
		border: none;
		width: 30px;
		font-size: 16px;
		height: 30px;
		border-radius: 8px;
		margin-top: 5px;
	}
	`,
	onLoad: function(container) {
		container.querySelector(".resetFilters").addEventListener("click",()=>{
			if(window.parent.Objects) {
				window.parent.Objects.targetRule.removeProperty("filter");
			}
		});
	},
	onChange: function(container) {
	  var final = "";
  container.querySelectorAll(`input[placeholder="value"]`).forEach((d)=>{
    var p = d.getAttribute("prop");
    var v = d.value;
    if(parseFloat(v) != "") {
      final += `${p}(${v}) `;
    }
  });
  if(CSS.supports("filter",final.trim()) && window.parent.Objects.targetRule) {
     window.parent.Objects.targetRule.filter = final.trim();
  }
}
});
insertController({
	section:"effects",
	html:`
	<div>
	<h3>backdrop-filter</h3>
		<range-input unit="px" range-input="true" min="0" max="100" value="0" title="blur" data-prop="blur" prop="blur"></range-input>
	<range-input unit="%" range-input="true" min="0" max="200" value="0" title="brightness" data-prop="brightness" prop="brightness"></range-input>
		<range-input unit="%" range-input="true" min="0" max="200" value="0" title="contrast" data-prop="contrast" prop="contrast"></range-input>
		<range-input unit="%" range-input="true" min="0" max="100" value="0" title="grayscale" data-prop="grayscale" prop="grayscale"></range-input>
		<range-input unit="%" range-input="true" min="0" max="100" value="0" title="sepia" data-prop="sepia" prop="sepia"></range-input>
		<button class="resetFilters">&times;</button>
	</div>
	`,
	css:`
	.resetFilters {
		background: linear-gradient(gold,orange,gold);
		border: none;
		width: 30px;
		font-size: 16px;
		height: 30px;
		border-radius: 8px;
		margin-top: 5px;
	}
	`,
	onLoad: function(container) {
		container.querySelector(".resetFilters").addEventListener("click",()=>{
			if(window.parent.Objects) {
				window.parent.Objects.targetRule.removeProperty("backdrop-filter");
			}
		});
	},
	onChange: function(container) {
	  var final = "";
  container.querySelectorAll(`input[placeholder="value"]`).forEach((d)=>{
    var p = d.getAttribute("prop");
    var v = d.value;
    if(parseFloat(v) != "") {
      final += `${p}(${v}) `;
    }
  });
  if(CSS.supports("filter",final.trim()) && window.parent.Objects.targetRule) {
     window.parent.Objects.targetRule.backdropFilter = final.trim();
  }
}
});
insertController({
  section: "effects",
  html: `
  <div class="transform-controller">
<div class="heading">Transform</div>

<range-input min="-200" max="200" title="Translate X" unit="px" prop="translateX"></range-input>
<range-input min="-200" max="200" title="Translate Y" unit="px" prop="translateY"></range-input>

<range-input min="0" max="360" title="Rotate" unit="deg" prop="rotate"></range-input>
<range-input min="0" max="360" title="Rotate X" unit="deg" prop="rotateX"></range-input>
<range-input min="0" max="360" title="Rotate Y" unit="deg" prop="rotateY"></range-input>
<range-input value="1" min="1" max="3" step="0.1" title="Scale X" prop="scaleX" unit=""></range-input>
<range-input value="1" min="1" max="3" step="0.1" title="Scale Y" unit="" prop="scaleY"></range-input>
<range-input min="-45" max="45" title="Skew X" unit="deg" prop="skewX"></range-input>
<range-input min="-45" max="45" title="Skew Y" unit="deg" prop="skewY"></range-input>
<button class="reset-transform">Reset</button>
  </div>
  `,
  css: `
  .transform-controller {
    padding: 12px;
    display: flex;
    flex-direction: column;
    gap: 10px;
  }
  .transform-controller .heading {
    font-weight: 600;
    color: #333;
    font-size: 16px;
    margin-bottom: 4px;
  }
  .transform-controller div[prop] {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 8px;
  }
  .transform-controller label {
    flex: 1;
    font-size: 13px;
    color: #444;
  }
  .transform-controller input[type="range"] {
    flex: 2;
  }
  .transform-controller .reset-transform {
    background: linear-gradient(gold,orange,gold);
      border: none;
      width: 60px;
      font-size: 12px;
      height: 30px;
      border-radius: 8px;
  }
  .transform-controller .reset-transform:hover {
    background: #ddd;
  }
  `,
  onChange: function(element) {
    var v = "";
    const values = element.querySelectorAll('[placeholder="value"]');
    values.forEach((val)=>{
      if(parseFloat(val.value)) {
        v+=` ${val.getAttribute("prop")}(${val.value})`;
      }
    });
    var final = String(v).trim();
    if(CSS.supports("transform",final)) {
     if(window.parent.Objects) {
        window.parent.Objects.targetRule.transform = final;
     } else {
       console.log(`${final} is ${CSS.supports("transform",final) ? "supported" : "not supported"}`);
     }
    }
  },
  onLoad: function(ref) {
    if(typeof config === "function"){
      config();
    }
  }
});
insertController({
  html: `
  <div id="Clicks">
  
  </div>
  <br>
  <div id="Gradients"></div>
  `,
  css: `
  button {
    background-image: linear-gradient(gold, orange, gold);
    border: none;
    width: auto;
    height: 40px;
    border-radius: 3px;
  }
  #Clicks {
  gap: 3px;
  display: flex;
  flex-wrap: wrap;
  }
  button:active {
    height: 38px;
  }
  .GB {
    width: 50px;
    height: 50px;
    border-radius: 50px;
  }
  #Gradients {
    display: flex;
    gap: 5px;
    flex-wrap: wrap;
  }
  `,
  onLoad: function(container) {
  var functions = {
  "flexible container": function(button) {
      if(window.parent.Objects) {
        window.parent.Objects.targetRule.display = "flex";
      }
    },
  "grid layout": function() {
    if(window.parent.Objects) {
        window.parent.Objects.targetRule.display = "grid";
        window.parent.Objects.targetRule.gridAutoColumns = "33.3fr 33.3fr 33.3fr";
        window.parent.Objects.targetRule.gridAutoRows = "33.3fr 33.3fr 33.3fr";
        window.parent.Objects.targetRule.gridTemplateAreas = `
        "top top top"
        "cent cent cent"
        "dwn dwn dnw"
        `;
      }
  },
  "vertical column": function(button) {
    if(window.parent.Objects) {
      window.parent.Objects.targetRule.display = "flex";
      window.parent.Objects.targetRule.flexDirection = "column";
    }
    },
  "heretical row": function(button) {
    if(window.parent.Objects) {
      window.parent.Objects.targetRule.display = "flex";
      window.parent.Objects.targetRule.flexDirection = "row";
    }
    },
  "center childrens": function(button) {
      if(window.parent.Objects) {
        var p = ["justify-content","justify-items","align-content","align-items"];
        if(window.parent.Objects.targetRule.display != "flex") {
          window.parent.Objects.targetRule.display = "flex";
        }
        p.forEach((d)=>{
          if(d) {
            window.parent.Objects.targetRule[String(d).replace(/-([a-z])/g,(_,char)=>{
              return char.toUpperCase().replace("-","");
            })] = 'center';
          }
        });
      }
    },
  "center parent": function(button) {
     if(window.parent.Objects) {
      window.parent.Objects.targetRule.display = "flex";
      window.parent.Objects.targetRule.alignSelf = "center";
      window.parent.Objects.targetRule.placeSelf = "center";
      window.parent.Objects.targetRule.justifySelf = "center";
      }
    },
"background as a Color": function(button) {
    window.parent.Objects.targetRule.backgroundClip = "text";
    window.parent.Objects.targetRule.color = "rgba(0,0,0,0)";
    window.parent.Objects.targetRule.backgroundImage = "linear-gradient(217deg, rgb(0, 236, 255) 0%, rgb(112, 255, 29) 100%)";
  },
  "3×3 Grid Layout": function() {
    window.parent.Objects.targetRule.display = "grid";
    window.parent.Objects.targetRule.gridTemplateAreas = `
    "top top top"
    "bar bar bar"
    "dwn dwn dwn"
    `;
    window.parent.Objects.targetRule.gridAutoColumns = "33.3fr 33.3fr 33.3fr";
    window.parent.Objects.targetRule.gridAutoRows = "33.3fr 33.3fr 33.3fr";
  }
  };
  var Gradients = [
    "linear-gradient(gold,orange,gold)",
    "linear-gradient(135deg, rgb(102, 126, 234) 0%, rgb(118, 75, 162) 100%)",
  "linear-gradient(120deg, rgb(255, 107, 107) 0%, rgb(254, 202, 87) 50%, rgb(238, 90, 111) 100%)",
  "linear-gradient(135deg, rgb(102, 126, 234) 0%, rgb(118, 75, 162) 100%)",
  "linear-gradient(to right, rgb(19, 78, 94) 0%, rgb(113, 178, 128) 100%)",
  "linear-gradient(45deg, rgb(255, 8, 68) 0%, rgb(255, 177, 153) 100%)",
  "linear-gradient(135deg, rgb(0, 198, 255) 0%, rgb(0, 114, 255) 100%)",
  "linear-gradient(to right, rgb(248, 87, 166) 0%, rgb(255, 88, 88) 100%)",
  "linear-gradient(120deg, rgb(142, 45, 226) 0%, rgb(74, 0, 224) 100%)",
  "linear-gradient(135deg, rgb(17, 153, 142) 0%, rgb(56, 239, 125) 100%)",
  "linear-gradient(to right, rgb(247, 151, 30) 0%, rgb(255, 210, 0) 100%)",
  "linear-gradient(to right, rgb(44, 62, 80) 0%, rgb(52, 152, 219) 100%)",
  "linear-gradient(135deg, rgb(235, 51, 73) 0%, rgb(244, 92, 67) 100%)",
  "linear-gradient(to right, rgb(161, 140, 209) 0%, rgb(251, 194, 235) 100%)",
  "linear-gradient(120deg, rgb(240, 147, 251) 0%, rgb(245, 87, 108) 100%)",
  "linear-gradient(135deg, rgb(142, 14, 0) 0%, rgb(31, 28, 24) 100%)",
  "linear-gradient(to right, rgb(255, 236, 210) 0%, rgb(252, 182, 159) 100%)",
  "linear-gradient(45deg, rgb(250, 112, 154) 0%, rgb(254, 225, 64) 100%)",
  "linear-gradient(120deg, rgb(46, 49, 146) 0%, rgb(27, 255, 255) 100%)",
  "linear-gradient(135deg, rgb(252, 74, 26) 0%, rgb(247, 183, 51) 100%)",
  "linear-gradient(to right, rgb(224, 234, 252) 0%, rgb(207, 222, 243) 100%)",
  "linear-gradient(90deg, rgb(255, 0, 0) 0%, rgb(255, 127, 0) 16.66%, rgb(255, 255, 0) 33.33%, rgb(0, 255, 0) 50%, rgb(0, 0, 255) 66.66%, rgb(75, 0, 130) 83.33%, rgb(148, 0, 211) 100%)",
  "linear-gradient(135deg, rgb(229, 57, 53) 0%, rgb(227, 93, 91) 100%)",
  "linear-gradient(to right, rgb(237, 66, 100) 0%, rgb(255, 237, 188) 100%)",
  "linear-gradient(135deg, rgb(0, 210, 255) 0%, rgb(58, 123, 213) 100%)",
  "linear-gradient(120deg, rgb(214, 109, 117) 0%, rgb(226, 149, 135) 100%)",
  "linear-gradient(45deg, rgb(210, 153, 194) 0%, rgb(254, 249, 215) 100%)",
  "linear-gradient(to right, rgb(28, 216, 210) 0%, rgb(147, 237, 199) 100%)",
  "linear-gradient(135deg, rgb(188, 78, 156) 0%, rgb(248, 7, 89) 100%)",
  "linear-gradient(to right, rgb(252, 203, 144) 0%, rgb(213, 126, 235) 100%)",
  "linear-gradient(120deg, rgb(106, 48, 147) 0%, rgb(160, 68, 255) 100%)",
  "linear-gradient(135deg, rgb(86, 171, 47) 0%, rgb(168, 224, 99) 100%)",
  "linear-gradient(to right, rgb(183, 152, 145) 0%, rgb(148, 113, 107) 100%)",
  "linear-gradient(45deg, rgb(117, 127, 154) 0%, rgb(215, 221, 232) 100%)",
  "linear-gradient(to right, rgb(69, 104, 220) 0%, rgb(176, 106, 179) 100%)",
  "linear-gradient(135deg, rgb(0, 242, 96) 0%, rgb(5, 117, 230) 100%)",
  "linear-gradient(120deg, rgb(253, 187, 45) 0%, rgb(34, 193, 195) 100%)",
  "linear-gradient(to right, rgb(238, 9, 121) 0%, rgb(255, 106, 0) 100%)",
   "linear-gradient(135deg, #f5f5f5, #cfcfcf, #9e9e9e)",
  "linear-gradient(90deg, #e6e6e6, #bdbdbd)",
  "linear-gradient(135deg, #ffffff, #d9d9d9, #a6a6a6)",
  "linear-gradient(180deg, #eeeeee, #c2c2c2)",
  "linear-gradient(135deg, #fafafa, #d1d1d1, #8f8f8f)",
  "linear-gradient(90deg, #f0f0f0, #b0b0b0, #dcdcdc)",
  "linear-gradient(135deg, #f8f8f8, #c8c8c8, #a0a0a0)",
  "linear-gradient(180deg, #ededed, #b5b5b5)"
    ];
  container.addEventListener("dragover", function(e) {
  e.preventDefault();
});
var dragged = false;
container.addEventListener("drop", function(e) {
  e.preventDefault();
    var G = document.createElement("div");
    G.className = "GB";
    G.style.backgroundImage = window.draggedBGImage;
    G.onclick = function(e) {
      if(window.parent.Objects) {
         window.parent.Objects.targetRule.backgroundImage = e.target.style.backgroundImage;
         window.parent.Objects.trigger = "click";
         window.parent.Objects.propType = "click";
      }
    };
    container.querySelector("#Gradients").appendChild(G);
});
  Object.keys(functions).forEach(function(func){
  var button = document.createElement("button");
  button.innerText = func;
  button.onclick = function (e) {
    functions[func](e.target);
  };
  container.getElementById("Clicks").appendChild(button);
  });
  Gradients.forEach((Gradient)=>{
    var G = document.createElement("div");
    G.className = "GB";
    G.style.backgroundImage = Gradient;
    G.onclick = function(e) {
      if(window.parent.Objects) {
        window.parent.Objects.trigger = "afterChange";
        window.parent.Objects.targetRule.backgroundImage = e.target.style.backgroundImage;
      }
    };
    container.querySelector("#Gradients").appendChild(G);
  });
  },
  section: "One-Click"
});
window.canIPaint = true;
insertController({
  section: "background",
  html: `
  <br><br><br><br><br>
  <div class="Gradientor">
    <h3>Colors</h3>
    <button class="addStopColor">+</button>
    <div id="Stops"></div>
    <div class="flexdiv">
      <h5 class="mode-title">Mode</h5>
      <select class="gradMode">
        <option>linear-gradient</option>
        <option>conic-gradient</option>
        <option>radial-gradient</option>
        <option>repeating-linear-gradient</option>
        <option>repeating-radial-gradient</option>
      </select>
      
      <!-- Shape selector for radial gradients -->
      <select class="gradShape" style="display:none;">
        <option value="">default</option>
        <option value="circle">circle</option>
        <option value="ellipse">ellipse</option>
      </select>
      
      <!-- Size selector for radial gradients -->
      <select class="gradSize" style="display:none;">
        <option value="">default</option>
        <option value="closest-side">closest-side</option>
        <option value="closest-corner">closest-corner</option>
        <option value="farthest-side">farthest-side</option>
        <option value="farthest-corner">farthest-corner</option>
      </select>
      
      <!-- Position selector for radial gradients -->
      <select class="gradPosition" style="display:none;">
        <option value="at center">at center</option>
        <option value="at top">at top</option>
        <option value="at bottom">at bottom</option>
        <option value="at left">at left</option>
        <option value="at right">at right</option>
        <option value="at top left">at top left</option>
        <option value="at top right">at top right</option>
        <option value="at bottom left">at bottom left</option>
        <option value="at bottom right">at bottom right</option>
      </select>
      
      <select class="ft">
        <option value="to">to</option>
        <option value="from">from</option>
        <option selected>angle only</option>
      </select>
      <input type="range" class="gradAngle" value="0" min="-360" max="360" step="1" style="width:150px;margin-left:10px;">
      <span class="angleValue">0°</span>
      <button class="deleteBtn">Delete</button>
    </div>
    <div draggable="true" class="preview" style="margin-top:10px;height:100px;border-radius:5px;"></div>
  </div>
  `,
  css: `
  .Gradientor > #Stops > .ColorSelector {
    background-color: red;
    display: flex;
    flex-direction: row;
    align-items: center;
  }
  .Gradientor {
    background-image: url('./dottedBG.png');
    background-color: #1a1a1a;
    border-radius: 15px;
    box-shadow: 0 0 10px black;
    max-width: calc(100vw - 30px);
    height: auto;
    padding: 10px;
    display: flex;
    flex-direction: column;
    gap: 10px;
  }
  .Gradientor > h3 {
    font-size: 15px;
    margin: 0;
    color: silver;
  }
  .mode-title { color: silver; margin: 0; }
  .angleValue { color: silver; font-size: 12px; }
  .Gradientor > #Stops {
    display: flex;
    gap: 6px;
    flex-wrap: nowrap;
    flex-direction: column;
    width: 358px;
    height: auto;
    align-items: flex-start;
  }
  .Gradientor > #Stops > .ColorSelector {
    background: none;
    border: 1px solid rgba(104,104,104,0.054);
    min-width: 70%;
    min-height: 30px;
    width: auto;
    height: auto;
    flex-shrink: 0;
    cursor: grab;
    position: relative;
    padding: 5px;
    border-radius: 5px;
  }
  .Gradientor > #Stops > .ColorSelector input[type="color"] {
    width: 40px;
    height: 30px;
    border: none;
    cursor: pointer;
  }
  .flexdiv {
    display: flex;
    align-items: center;
    gap: 5px;
    flex-wrap: wrap;
  }
  .flexdiv > select, .gradAngle, button {
    background-image: linear-gradient(gold, orange, gold);
    border: none;
    text-align: center;
    height: 35px;
    border-radius: 5px;
    font-size: 12px;
    padding: 0 8px;
  }
  .gradShape, .gradSize, .gradPosition {
    background-image: linear-gradient(#4CAF50, #45a049, #4CAF50);
  }
  .addStopColor {
    background: linear-gradient(gold, orange, gold);
    border: none;
    width: 30px;
    height: 30px;
    border-radius: 5px;
    cursor: pointer;
  }
  .color-slider {
    appearance: none;
    width: 150px;
    height: 22px;
    border-radius: 5px;
    box-shadow: inset 0 0 10px black;
    background: none;
    margin-left: 10px;
  }
  .color-slider::-webkit-slider-thumb {
    appearance: none;
    background: linear-gradient(gold, orange, gold);
    width: 20px;
    height: 20px;
    border-radius: 5px;
    cursor: pointer;
  }
  .color-slider::-moz-range-thumb {
    background: linear-gradient(gold, orange, gold);
    width: 20px;
    height: 20px;
    border-radius: 5px;
    cursor: pointer;
    border: none;
  }
  .gradAngle {
    appearance: none;
    width: 150px;
    height: 22px;
    border-radius: 5px;
    box-shadow: inset 0 0 10px black;
    background: none;
    margin-left: 10px;
  }
  .gradAngle::-webkit-slider-thumb {
    appearance: none;
    background: linear-gradient(gold, orange, gold);
    width: 20px;
    height: 20px;
    border-radius: 5px;
    cursor: pointer;
  }
  .gradAngle::-moz-range-thumb {
    background: linear-gradient(gold, orange, gold);
    width: 20px;
    height: 20px;
    border-radius: 5px;
    cursor: pointer;
    border: none;
  }
  .delColor {
    color: red;
    margin-left: 10px;
    font-size: 20px;
    background: none;
    border: none;
    cursor: pointer;
  }
  .percentValue {
    color: silver;
    font-size: 12px;
    margin-left: 5px;
  }
  .preview {
    background-color: #000000;
    width: 100px;
    height: 100px;
    border-radius: 50px;
  }
  `,
  onLoad: function(container) {
    var stopsContainer = container.querySelector("#Stops");
    
    // Function to toggle radial gradient controls
    function toggleRadialControls() {
      const type = container.querySelector(".gradMode").value;
      const isRadial = type.includes("radial");
      const isLinear = type.includes("linear");
      const isConic = type.includes("conic");
      
      const shapeSelect = container.querySelector(".gradShape");
      const sizeSelect = container.querySelector(".gradSize");
      const positionSelect = container.querySelector(".gradPosition");
      const ftSelect = container.querySelector(".ft");
      const angleSlider = container.querySelector(".gradAngle");
      const angleValue = container.querySelector(".angleValue");
      
      // Show/hide controls based on gradient type
      if (isRadial) {
        shapeSelect.style.display = "inline-block";
        sizeSelect.style.display = "inline-block";
        positionSelect.style.display = "inline-block";
        ftSelect.style.display = "none";
        angleSlider.style.display = "none";
        angleValue.style.display = "none";
      } else if (isConic) {
        shapeSelect.style.display = "none";
        sizeSelect.style.display = "none";
        positionSelect.style.display = "none";
        ftSelect.style.display = "inline-block";
        ftSelect.value = "from";
        angleSlider.style.display = "inline-block";
        angleValue.style.display = "inline-block";
      } else if (isLinear) {
        shapeSelect.style.display = "none";
        sizeSelect.style.display = "none";
        positionSelect.style.display = "none";
        ftSelect.style.display = "inline-block";
        angleSlider.style.display = "inline-block";
        angleValue.style.display = "inline-block";
      }
    }
    
    // Function to update gradient
    function updateGradient() {
      var type = container.querySelector(".gradMode").value;
      var angle = container.querySelector(".gradAngle").value;
      var ft = container.querySelector(".ft").value;
      var shape = container.querySelector(".gradShape").value;
      var size = container.querySelector(".gradSize").value;
      var position = container.querySelector(".gradPosition").value;
      var stops = [];
      
      container.querySelectorAll(".ColorSelector").forEach(function(cs) {
        const percent = cs.querySelector(".color-slider")?.value;
        const color = cs.style.backgroundColor;
        stops.push(`${color} ${percent}%`);
      });

      let gradient;

      if (type.includes("linear")) {
        if (ft === "to") {
          gradient = `${type}(to ${angle}deg, ${stops.join(", ")})`;
        } else if (ft === "from") {
          gradient = `${type}(from ${angle}deg, ${stops.join(", ")})`;
        } else {
          gradient = `${type}(${angle}deg, ${stops.join(", ")})`;
        }
      } else if (type.includes("conic")) {
        gradient = `${type}(from ${angle}deg, ${stops.join(", ")})`;
      } else if (type.includes("radial")) {
        // Build radial gradient with shape, size, and position
        let radialParams = [];
        
        if (shape) radialParams.push(shape);
        if (size) radialParams.push(size);
        if (position) radialParams.push(position);
        
        const paramString = radialParams.length > 0 ? radialParams.join(" ") + ", " : "";
        gradient = `${type}(${paramString}${stops.join(", ")})`;
      }

      // Update preview
      const preview = container.querySelector(".preview");
      if (preview) {
        preview.style.backgroundImage = gradient;
      }

      return gradient;
    }

    // Add initial color stops
    function addColorStop(color = "#ffffff", percent = 50) {
      let newColor = document.createElement("div");
      newColor.className = "ColorSelector";
      newColor.style.pointerEvents = "none";
      
      // Color picker
      let colorPicker = document.createElement("div");
      colorPicker.className = "ColorSelector";
      colorPicker.setAttribute("data-select", true);
      colorPicker.style.pointerEvents = "auto";
      colorPicker.type = "color";
      colorPicker.style.backgroundColor = color;
      colorPicker.value = color;
      colorPicker.onclick = function(e) {
        e.stopPropagation();
        window.targetColorizer = colorPicker;
      showColoring(e);
      };
      colorPicker.addEventListener("input", updateGradient);

      // Slider for percentage
      let slider = document.createElement("input");
      slider.type = "range";
      slider.className = "color-slider";
      slider.min = 0;
      slider.style.pointerEvents = "auto";
      slider.max = 100;
      slider.value = percent;

      // Percentage display
      let percentDisplay = document.createElement("span");
      percentDisplay.className = "percentValue";
      percentDisplay.textContent = percent + "%";

      slider.addEventListener("input", (e) => {
        percentDisplay.textContent = e.target.value + "%";
        updateGradient();
      });

      // Delete button
      let delColor = document.createElement("button");
      delColor.className = "delColor";
      delColor.innerHTML = "&times;";
      delColor.style.pointerEvents = "auto";
      delColor.addEventListener("click", (e) => {
        e.target.closest(".ColorSelector").remove();
        updateGradient();
      });

      newColor.appendChild(colorPicker);
      newColor.appendChild(slider);
      newColor.appendChild(percentDisplay);
      newColor.appendChild(delColor);

      stopsContainer.appendChild(newColor);
      updateGradient();
    }

    // Add color button
    container.querySelector(".addStopColor").addEventListener("click", () => {
      addColorStop();
    });

    // Gradient mode change
    container.querySelector(".gradMode").addEventListener("change", () => {
      toggleRadialControls();
      updateGradient();
    });
    
    container.querySelector(".ft").addEventListener("change", updateGradient);
    container.querySelector(".gradShape").addEventListener("change", updateGradient);
    container.querySelector(".gradSize").addEventListener("change", updateGradient);
    container.querySelector(".gradPosition").addEventListener("change", updateGradient);
    
    // Angle slider
    const angleSlider = container.querySelector(".gradAngle");
    const angleValue = container.querySelector(".angleValue");
    angleSlider.addEventListener("input", (e) => {
      angleValue.textContent = e.target.value + "°";
      updateGradient();
    });
    
    // Delete button
    container.querySelector(".deleteBtn").onclick = function() {
      container.querySelector(".preview").style.backgroundImage = "";
      window.parent.Objects.targetRule.backgroundImage = "";
      container.querySelector("#Stops").innerHTML = "";
      container.querySelector(".gradMode").value = "linear-gradient";
      container.querySelector(".ft").value = "from";
      container.querySelector(".gradAngle").value = 0;
      container.querySelector(".gradShape").value = "";
      container.querySelector(".gradSize").value = "";
      container.querySelector(".gradPosition").value = "at center";
      
      toggleRadialControls();
      updateGradient();
    };
    
    // Initialize controls visibility
    toggleRadialControls();

    window.updateGradientState = function(obj) {
      window.canIPaint = false;
      stopsContainer.innerHTML = "";
      obj.Colors.forEach((c)=>{
        addColorStop(c.color,parseFloat(c.percentage));
      });
      container.querySelector(".gradMode").value = obj.type;
      container.querySelector(".gradAngle").value = obj.angle;
      container.querySelector(".ft").value = obj.angleType;
      if(obj.type == "radial-gradient") {
        container.querySelector(".gradShape").value = obj.shape ? obj.shape : container.querySelector(".gradShape").options[0].value;
      }
      setTimeout(function() {
        window.canIPaint = true;
      }, 10);
    };
    window.parent.updateGradientState = updateGradientState;
    /*
  updateGradientState({
    Colors: [
      {
      color: "red",
      percentage: 10
    },
      {
      color: "green",
      percentage: 30
    },
      {
      color: "blue",
      percentage: 60
    },
      {
      color: "deepskyblue",
      percentage: 40
    },
      {
      color: "black",
      percentage: 100
    },
    ],
    type: "repeating-linear-gradient",
    angle: 10,
    angleType: "from",
    shape: "circle"
  });
  */
  container.addEventListener("dragstart",(e)=>{
  if(e.target.style.backgroundImage) {
    window.draggedBGImage = e.target.style.backgroundImage;
  }
});
  },
  onChange: function(container,trigger) {
      var Colors = [];
    var colorPickers = container.querySelectorAll("div[data-select]");
    var mode = container.querySelector(".gradMode").value;
    
    colorPickers.forEach(c => {
      if (c.style.cssText) {
        Colors.push(c.style.backgroundColor + " " + c.parentElement.querySelector(".percentValue").innerHTML);
      }
    });
    
    var Gradient;
    
    if (mode.includes("radial")) {
      var shape = container.querySelector(".gradShape").value;
      var size = container.querySelector(".gradSize").value;
      var position = container.querySelector(".gradPosition").value;
      
      let radialParams = [];
      if (shape) radialParams.push(shape);
      if (size) radialParams.push(size);
      if (position) radialParams.push(position);
      
      const paramString = radialParams.length > 0 ? radialParams.join(" ") + ", " : "";
      Gradient = `${mode}(${paramString}${Colors.join(", ")})`;
    } else if (mode.includes("conic")) {
      var angle = container.querySelector(".gradAngle").value;
      Gradient = `${mode}(from ${angle}deg, ${Colors.join(", ")})`;
    } else {
      var ft = container.querySelector(".ft").value;
      var angle = container.querySelector(".gradAngle").value;
      var A = ft !== "angle only" ? ft + ` ${angle}deg` : angle + "deg";
      Gradient = `${mode}(${A}, ${Colors.join(", ")})`;
    }
    if(container.querySelector(".gradMode").value.includes("linear")) {
      container.querySelector('.ft').value = "angle only";
    }
    container.querySelector(".preview").style.backgroundImage = Gradient;
    
    var GraData = {
      Gradient,
      supported: CSS.supports("background-image", Gradient)
    };
    
    if (window.parent.Objects) {
    if (GraData.supported && window.canIPaint) {
       window.parent.Objects.targetRule.backgroundImage = GraData.Gradient;
       window.parent.Objects.trigger = trigger;
      } else {
        // alert("Gradient syntax is not supported");
      }
    }
  }
});
insertController({
    section: "Layout",
    css: `   #grid {
      background-color: rgb(240, 240, 240);
      width: 90%;
      height: 450px;
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      grid-template-rows: repeat(3, 1fr);
      /* 🗺️ خريطة متطابقة ومثالية تحتوي على كافة الحروف الحية للعناصر */
      grid-template-areas: 
        "a b c" 
        "e b g" 
        "h d f"; 
      gap: 16px;
      padding: 10px;
      box-sizing: border-box;
    }
    #grid .square {
      color: #fff;
      font-weight: bold;
      font-family: sans-serif;
      display: flex;
      align-items: center;
      justify-content: center;
      border-radius: 6px;
      cursor: pointer;
      box-shadow: 0 4px 6px rgba(0,0,0,0.1);
      transition: transform 0.2s;
    }
    #grid .square:hover {
      transform: scale(1.05);
    }
    #grid .square:nth-child(1) { background-color: #ff4757; }
    #grid .square:nth-child(2) { background-color: green; grid-area: a; }
    #grid .square:nth-child(3) { background-color: gold; grid-area: b; color: #000; }
    #grid .square:nth-child(4) { background-color: blue; grid-area: c; }
    #grid .square:nth-child(5) { background-color: pink; grid-area: d; color: #000; }
    #grid .square:nth-child(6) { background-color: deepskyblue; grid-area: e; }
    #grid .square:nth-child(7) { background-color: gray; grid-area: f; }
    #grid .square:nth-child(8) { background-color: yellow; grid-area: g; color: #000; }
    #grid .square:nth-child(9) { background-color: #00fff1; grid-area: h; color: #000; }`,
    html: `
  <div id="grid-editor"></div>`,
    onLoad: function(cont) {
    class GridBox {
      constructor(options) {
        this.options = options;
        this.State = {
          container: null,
          child: null
        };
        var shadow = this.options.container.attachShadow({
          mode: "open"
        });
        shadow.innerHTML = `
        <link rel="stylesheet" href="./custom-elements.css">
          <div id="grid-root">
            <div id="control-panel">
              <div class="panel-section" id="child-section">
                <h4 class="prop-title">Child Grid Area</h4>
                <select id="areas"></select>
              </div>

              <div class="panel-section" id="container-section">
                <h4 class="prop-title">Grid Template Areas</h4>
                <textarea id="template-areas-input" placeholder='"header header" "sidebar content"'></textarea>
                
                <range-input id="grid-cols-range" prop="grid-template-columns" title="Columns Count" min="1" max="12" value="3" unit="fr"></range-input>
                
                <br>
                <range-input id="grid-rows-range" prop="grid-template-rows" title="Rows Count" min="1" max="12" value="3" unit="fr"></range-input>
                <br>
                <range-input id="grid-gap-range" prop="grid-gap" title="Grid Gap" min="0" max="100" value="16" unit="px"></range-input>
              </div>
            </div>
          </div>

          <style>
            #grid-root {
              background: #1a1a1a;
              position: relative;
              width: 100%;
              padding: 20px;
              box-sizing: border-box;
              display: flex;
              flex-direction: column;
              align-items: center;
              border-radius: 15px;
              box-shadow: inset 0 0 15px black;
            }
            #control-panel {
              width: 350px;
              display: flex;
              flex-direction: column;
              gap: 15px;
            }
            .panel-section {
              background: #202020;
              padding: 15px;
              border-radius: 12px;
              box-shadow: inset 0 0 10px black;
              transition: 400ms;
            }
            #areas {
              width: 100%;
              height: 35px;
              border-radius: 50px;
              border: none;
              background: linear-gradient(gold, orange, gold);
              text-align: center;
              color: #000;
              font-weight: bold;
              cursor: pointer;
            }
            #template-areas-input {
              width: 100%;
              height: 70px;
              background: #111;
              color: orange;
              border: 1px solid #333;
              border-radius: 8px;
              padding: 8px;
              box-sizing: border-box;
              font-family: monospace;
              resize: none;
              margin-bottom: 15px;
              box-shadow: inset 0 0 5px black;
            }
            #template-areas-input:focus {
              outline: none;
              border-color: orange;
              box-shadow: 0 0 8px orange;
            }
          </style>
        `;

        this.areasSelect = this.options.container.shadowRoot.querySelector("#areas");
        this.areasTextarea = this.options.container.shadowRoot.querySelector("#template-areas-input");
        this.childSection = this.options.container.shadowRoot.querySelector("#child-section");
        this.containerSection = this.options.container.shadowRoot.querySelector("#container-section");
        this.initEvents();
      }

      setTarget(newTargetRule) {
        if (!newTargetRule || !newTargetRule.style) return;

        this.options.target = newTargetRule;
        
        // القراءة مباشرة من مراجع الـ CSSOM الممررة للحفاظ على التدرج الحقيقي 🧬
        let currentTemplateAreas = newTargetRule.style.gridTemplateAreas;
        let currentColumns = newTargetRule.style.gridTemplateColumns;
        let currentRows = newTargetRule.style.gridTemplateRows;
        let currentGap = newTargetRule.style.gridGap || newTargetRule.style.gap;

        if (currentTemplateAreas && currentTemplateAreas !== "none") {
          this.areasTextarea.value = currentTemplateAreas.split('" "').join('"\n"').trim();
        } else {
          this.areasTextarea.value = "";
        }

        const colsRange = this.options.container.shadowRoot.querySelector("#grid-cols-range");
        const rowsRange = this.options.container.shadowRoot.querySelector("#grid-rows-range");
        const gapRange = this.options.container.shadowRoot.querySelector("#grid-gap-range");

        if (colsRange && currentColumns) {
          const colsMatch = currentColumns.match(/\d+/);
          if (colsMatch) {
            colsRange.value = colsMatch[0];
            colsRange.setAttribute("value", colsMatch[0]);
          }
        }

        if (rowsRange && currentRows) {
          const rowsMatch = currentRows.match(/\d+/);
          if (rowsMatch) {
            rowsRange.value = rowsMatch[0];
            rowsRange.setAttribute("value", rowsMatch[0]);
          }
        }

        if (gapRange && currentGap) {
          const gapMatch = currentGap.match(/\d+/);
          if (gapMatch) {
            gapRange.value = gapMatch[0];
            gapRange.setAttribute("value", gapMatch[0]);
          }
        }
      }

      searchByArea(areaName) {
  let myNodeRule = false;
  if (!window.currentCssRulesArray) return false;

  for (let i = 0; i < window.currentCssRulesArray.length; i++) {
    const ruleObj = window.currentCssRulesArray[i];
    if (ruleObj.rule && ruleObj.rule.style) {
      // قراءة الـ gridArea النظيفة المكتوبة في القاعدة نفسها
      const cleanArea = ruleObj.rule.style.gridArea.split("/")[0].trim();
      if (cleanArea === areaName) {
        myNodeRule = ruleObj.rule;
        break; // نخرج فوراً بمجرد إيجاد التطابق الأول لمنع التداخل
      }
    }
  }
  return myNodeRule;
}
      Highlight(el) {
    var map = {};
    getComputedStyle(el).gridTemplateAreas.replaceAll(".","").replaceAll("\"","").split(' ').forEach((area)=>{
      if(area) {
        map[area] = true;
      }
    });
    var appendings = [];
    function SearchAreaByNode(node) {
      var call = false;
      el.querySelectorAll("*").forEach((l)=>{
        if(l && getComputedStyle(l).gridArea == node) {
          call = l;
        }
      });
      return call;
    }
  Object.keys(map).forEach((area,i)=>{
  var div = document.createElement("div");
  div.style.cssText = `
    color: #000;
    font-weight: bold;
    font-family: sans-serif;
      font-size: 1.2rem;
    display: flex;
      justify-content: center;
    	justify-items: center;
    align-items: center;
    align-content: center;
    border-radius: 8px;
    box-shadow: 0 4px 8px rgba(0,0,0,0.3);
    transition: transform 0.2s;
    background: rgba(33,111,111,0.465);`;
     div.className = "box";
     div.style.position = "relative";
     div.style.gridArea = area;
     div.innerText = area;
     setTimeout(function() {
       if(!SearchAreaByNode(area)) {
         el.appendChild(div);
         appendings.push(div);
       }
     }, 120*i);
    });
    setTimeout(function() {
      appendings.forEach((el,i)=>{
        if(el) {
          el.remove();
        }
      });
    }, 700);
  }

      setMode(mode, ruleElement) {
        if (mode === "container") {
          this.State.container = ruleElement;
          
          this.containerSection.style.opacity = "1";
          this.containerSection.style.pointerEvents = "auto";
          this.childSection.style.opacity = "0.4";
          this.childSection.style.pointerEvents = "none";

          const rawAreas = ruleElement.style.gridTemplateAreas;
          if (rawAreas && rawAreas !== "none") {
            this.areasTextarea.value = rawAreas.split('" "').join('"\n"').trim();
          }

          const uniqueAreas = {};
          this.areasSelect.innerHTML = "";

          if (rawAreas) {
            const matches = rawAreas.match(/[a-zA-Z0-9_-]+/g);
            if (matches) {
              matches.forEach((areaName) => {
                const cleanName = areaName.trim();
                if (cleanName && cleanName !== "." && cleanName !== "none") {
                  uniqueAreas[cleanName] = true;
                }
              });
            }
          }

          Object.keys(uniqueAreas).forEach((area) => {
            const opt = new Option(area, area);
            this.areasSelect.appendChild(opt);
          });

        } else if (mode === "child") {
          this.State.child = ruleElement;

          this.childSection.style.opacity = "1";
          this.childSection.style.pointerEvents = "auto";
          this.containerSection.style.opacity = "0.4";
          this.containerSection.style.pointerEvents = "none";

          const currentArea = ruleElement.style.gridArea.split("/")[0].trim();
          this.areasSelect.value = currentArea;
        }
      }

      initEvents() {
        this.areasSelect.addEventListener("change", (e) => {
  if (!this.State.child) return;

  const selectedAreaName = e.target.value;
  const newChildRule = this.State.child;
  
  // 1. استخراج المنطقة الحالية للطفل النشط بدقة وتنظيفها
  const currentChildArea = newChildRule.style.gridArea.split("/")[0].trim();
  
  // إذا اخترنا نفس المنطقة الحالية لا نفعل شيئاً منعاً للمتاهات الدائرية 🔄
  if (selectedAreaName === currentChildArea) return;

  // 2. البحث عن القاعدة الأخرى التي تحتل المنطقة المستهدفة حالياً
  const orgChildRule = this.searchByArea(selectedAreaName);

  // 3. التبادل الآمن والمضمون بنسبة 100% 🔒
  if (orgChildRule && orgChildRule !== newChildRule) {
    // نغير القاعدة القديمة أولاً لتأخذ منطقة الطفل الحالية وتخلي مكانها
    orgChildRule.style.gridArea = currentChildArea;
  }
  
  // 4. الآن نمنح الطفل النشط منطقته الجديدة بسلام دون أن يجد أحداً يزاحمه فيها
  newChildRule.style.gridArea = selectedAreaName;

  // 5. 🚀 تحديث الواجهة تلقائياً لتعكس الخريطة الجديدة في قائمة الـ Select
  // نقوم بإعادة قراءة الـ Mode لتحديث الـ uniqueAreas بناءً على التغيير الفيزيائي الجديد
  if (this.State.container) {
    this.setMode("container", this.State.container);
    // إعادة تثبيت حالة الطفل النشط حتى لا تفقد الواجهة التركيز عليه
    this.State.child = newChildRule;
    this.childSection.style.opacity = "1";
    this.childSection.style.pointerEvents = "auto";
    this.areasSelect.value = selectedAreaName;
  }
});


        this.areasTextarea.addEventListener("input", (e) => {
          if (this.State.container) {
            const formattedValue = e.target.value.replace(/\n/g, " ");
            this.State.container.style.gridTemplateAreas = formattedValue;
          }
        });

        this.options.container.shadowRoot.addEventListener("input", (e) => {
          const targetInput = e.target;
          const property = targetInput.getAttribute("prop");
          const unit = targetInput.getAttribute("unit") || "";
          
          if (this.State.container && property) {
            if (property === "grid-template-columns" || property === "grid-template-rows") {
              this.State.container.style[property] = `repeat(${targetInput.value}, 1fr)`;
            } else {
              this.State.container.style[property] = targetInput.value + unit;
            }
          }
        });
      }

      setOption(name, value) { this[name] = value; }
      getOption(name) { return this[name]; }
    }
    
    const actualGridDOM = cont.querySelector("#grid");

    const myGridEditor = new GridBox({
      target: null,
      container: cont.querySelector("#grid-editor"),
    });
   window.myGridEditor = myGridEditor;
   window.parent.myGridEditor = myGridEditor;
   if(typeof window.parent.onChange == "function") {
     window.parent.onChange((e)=>{
     if(e.type == "click") {
       myGridEditor.setTarget(e.cssRules[0].rule);
       if(e.event && e.event.target && getComputedStyle(e.event.target).display == "grid" && getComputedStyle(e.event.target).gridTemplateAreas != "none") {
         myGridEditor.setMode("container",e.cssRules[0].rule);
       }
       if(e.event && e.event.target && getComputedStyle(e.event.target.parentElement).display == "grid" && getComputedStyle(e.event.target.parentElement).gridTemplateAreas != "none") {
         myGridEditor.setMode("child",e.cssRules[0].rule);
       }
     }
   });
   }
    }
  });
insertController({
  section: "Layout",
  html: `
   <range-input unit="px" min="0" max="1000" title="Size" data-prop="Size" oninput="setSizeOfElement(this.value)"></range-input>
  `,
  onLoad: function(element) {
  window.setSizeOfElement = function(val) {
   if(window.parent.Objects && val && val.value) {
     if(window.parent.Objects.targetRule) {
          window.parent.Objects.targetRule.width = val.value;
          window.parent.Objects.targetRule.height = val.value;
        }
      }
    };
  }
});
insertController({
  section: "typography",
  html: `
  <b>Upload Your Font</b>
  <div class="UFont">
  <input type="text" id="fontName" placeholder="Name">
  <button onclick="uploadFont()">Upload</button>
  </div>
  `,
  css: `
  .UFont {
    background: #1a1a1a;
    justify-content: center;
  	justify-items: center;
  	align-items: center;
  	align-content: center;
  	display: flex;
  }
  b {
  color: white;
  display: flex;
  align-self: center;
  justify-self: center;
  place-self: center;
  }
  button {
    background: linear-gradient(gold,orange,gold);
    border: none;
    width: 130px;
    height: 33px;
    border-top-right-radius: 50px;
    border-bottom-right-radius: 50px;
  }
  input[type="text"] {
    height: 33px;
    border: 1px solid orange;
    text-align: center;
    outline: none;
    border-top-left-radius: 50px;
    border-bottom-left-radius: 50px;
    background: #1a1a1a;
    color: silver;
  }
  `,
  onLoad: function(container) {
    var fontName = container.querySelector("#fontName");
    window.uploadFont = function() {
   var f = document.createElement("input");
   f.type = "file";
   f.multiple = false;
   f.onchange = function() {
     if(String(f.files[0].type).startsWith("font/") && String(fontName.value).trim() != "" && window.parent.Entrypoint) {
       var font = new Option(fontName.value,fontName.value);
      document.querySelector(`select[prop="fontFamily"]`).appendChild(font);
       if(![...window.parent.Entrypoint.sheetX.cssRules].some(rule => rule instanceof CSSFontFaceRule && rule.style.fontFamily == `"${fontName.value}"`)) {
         window.parent.Entrypoint.sheetX.insertRule(`
  @font-face {
    font-family: "${fontName.value}";
    src: url('${window.URL.createObjectURL(f.files[0])}') format('opentype');
    font-weight: normal;
    font-style: normal;
    font-display: swap;
  }
       `, window.parent.Entrypoint.sheetX.cssRules.length);
       if(window.parent.Objects) {
         if(window.parent.Objects.targetRule) {
           window.parent.Objects.targetRule.fontFamily = fontName.value;
         }
       }
       } else {
         alert("already have");
       }
       fontName.value = "";
     } else {
       fontName.placeholder = "name is required";
       setTimeout(function() {
         fontName.placeholder = "Name";
       }, 2000);
     }
   }
   f.click();
    };
  }
});
}
window.addEventListener("load",()=>{
function a() {
  initControllers();
	config();
}
a();
});


/* Coloring API Instructions */

  //alert("Created By onChange"); // alert
 //alert(element.querySelector("div").style.color);
	// targetColorizer = target element (<div class="ColorSelector"></div>)
	//alert(targetColorizer.style.color);
	// regular DOM Element
	//alert(targetColor);
	// hideColorPicker(); to hide interface
	
	    /*
    translateX: px
translateY: px
rotate: deg
rotateX: deg
rotateY: deg,
scaleX: ,
scaleY: ,
skewX: deg,
skewY: deg,
    */
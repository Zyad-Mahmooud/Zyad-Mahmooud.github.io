function returnDOM(html) {
  const parser = new DOMParser();
  const page = parser.parseFromString(html, "text/html");
  const bodyChild = page.querySelector("body > *");
  return bodyChild;
}
var MediaNode = null;
function newClasses(ref,parent) {
  if(!ref) return;
  return Paint.deepCloneNodeWithStyles(ref,parent);
}
function appendChild(parent,child) {
  var c = newClasses(child,parent);
  parent.appendChild(c);
  for (f of window.parent.functionsList) {
      if(typeof f == "function") {
        f({
          type: "DOM",
          trigger: "addNode",
          target: parent,
          addedNode: c,
          addedNodeCSSRules: Entrypoint.cssomOf(c),
          CSSRules: Entrypoint.cssomOf(parent),
        });
        if(c instanceof HTMLMediaElement) {
          MediaNode = c;
          if(programs) programs?.video?.(c);
          window.parent.openDOMEditor();
        } else {
          MediaNode = false;
        }
      }
    }
    return c;
}
window.addEventListener("load",()=>{
var templates = {
  // --- الأزرار وحقول الإدخال الأساسية ---
  Button: function(el, isPreview) {
    var node = document.createElement("button");
    node.innerText = "Click Me";
    node.className = `pi-${node.localName}-default`;
    return node;
  },
  Box: function(el, isPreview) {
    var node = document.createElement("div");
    node.innerText = "Space";
    node.className = `pi-${node.localName}-default`;
    return node;
  },
  "Text Box": function(el, isPreview) {
    var node = document.createElement("input");
    node.type = "text";
    node.placeholder = "Enter text...";
    node.className = `pi-${node.localName}-${node.type}-default`;
    return node;
  },
  "Pass Box": function(el, isPreview) {
    var node = document.createElement("input");
    node.type = "password";
    node.placeholder = "Enter password...";
    node.className = `pi-${node.localName}-${node.type}-default`;
    return node;
  },
  "Reset Button": function(el, isPreview) {
    var node = document.createElement("input");
    node.type = "reset";
    node.value = "Reset";
    node.className = `pi-${node.localName}-${node.type}-default`;
    return node;
  },
  Range: function(el, isPreview) {
    var node = document.createElement("input");
    node.type = "range";
    node.min = 0;
    node.max = 100;
    node.value = 30;
    node.className = `pi-${node.localName}-${node.type}-default`;
    return node;
  },
  // --- خيارات التحديد والرفع ---
  "Radio Button": function(el, isPreview) {
    var node = document.createElement("input");
    node.type = "radio";
    node.className = `pi-${node.localName}-${node.type}-default`;
    return node;
  },
  CheckBox: function(el, isPreview) {
    var node = document.createElement("input");
    node.type = "checkbox";
    node.className = `pi-${node.localName}-${node.type}-default`;
    return node;
  },
  "Select Menu": function(el, isPreview) {
    var node = document.createElement("select");
    node.appendChild(new Option("Apple","Apple"));
    node.appendChild(new Option("Orange","Orange"));
    node.appendChild(new Option("Banana","Banana"));
    node.className = `pi-${node.localName}-default`;
    return node;
  },
  "File Upload": function(el, isPreview) {
    var node = document.createElement("input");
    node.type = "file";
    node.className = `pi-${node.localName}-${node.type}-default`;
    return node;
  },
  
  // --- النصوص المتقدمة والعناوين ---
  Heading: function(el, isPreview) {
    var node = document.createElement("h2");
    node.innerText = "Heading Title";
    node.className = `pi-${node.localName}-default`;
    return node;
  },
  "Text Area": function(el, isPreview) {
    var node = document.createElement("textarea");
    node.placeholder = "Type your message here...";
    node.className = `pi-${node.localName}-default`;
    return node;
  },
  Paragraph: function(el, isPreview) {
    var node = document.createElement("p");
    node.innerText = "This is a paragraph text block.";
    node.className = `pi-${node.localName}-default`;
    return node;
  },
  "Hyper Link": function(el, isPreview) {
    var node = document.createElement("a");
    node.href = "#";
    node.setAttribute("click","FormErrorExplaination(event)");
    node.className = `pi-${node.localName}-default`;
    node.innerText = "Hyperlink Text";
    
    if(!isPreview) {
      if(typeof programs !== "undefined" && programs?.a) programs.a(node);
      if(window.parent && typeof window.parent.openDOMEditor === "function") {
        window.parent.openDOMEditor();
      }
    }
    return node;
  },

  // --- عناصر الميديا المتطورة ---
  image: function(el, isPreview) {
    var node = document.createElement("img");
    node.alt = "Placeholder Image";
    node.className = `pi-${node.localName}-default`;
    return node;
  },
  video: function(el, isPreview) {
    var node = returnDOM(`<video controls></video>`);
    node.className = `pi-${node.localName}-default`;
    return node;
  },
  Audio: function(el, isPreview) {
    var node = returnDOM(`<audio controls></audio>`);
    node.className = `pi-${node.localName}-default`;
    return node;
  },
  Iframe: function(el, isPreview) {
    var node = document.createElement("iframe");
    node.className = `pi-${node.localName}-default`;
    return node;
  },
  
  // --- تضمينات منصات التواصل الاجتماعي (Embeds) ---
  YouTube: function(el, isPreview) {
    var node = document.createElement("iframe");
    node.className = `pi-${node.localName}-default`;
    node.setAttribute("allowfullscreen", "true");
    node.src = "https://www.youtube.com/embed/";
    
    if(!isPreview) {
      if(typeof programs !== "undefined" && programs?.iframe) programs.iframe(el);
      if(window.parent && typeof window.parent.openDOMEditor === "function") {
        window.parent.openDOMEditor();
      }
    }
    return node;
  },
  Facebook: function(el, isPreview) {
    var node = document.createElement("iframe");
    node.className = `pi-${node.localName}-default`;
    node.setAttribute("scrolling", "no");
    node.setAttribute("allow", "encrypted-media");
    node.src = "https://www.facebook.com/plugins/page.php?href=";
    return node;
  },
  table: function(el, isPreview) {
    var node = returnDOM(`<table border="3">
  <tr>
    <th>Name</th>
    <th>Age</th>
  </tr>
  <tr>
    <td>Zyad</td><td>21</td>
  </tr>
  <tr>
    <td>Youssef</td><td>22</td>
  </tr>
  <tr>
    <td>Ahmed</td><td>19</td>
  </tr>
</table>`);
    node.className = `pi-${node.localName}-default`;
    return node;
  },
  dropdown: function(el, isPreview) {
    var node = returnDOM(`<select>
  <option>Apple 🍎</option>
  <option>Banana 🍌</option>
  <option>Lemonade 🍋</option>
</select>`);
    node.className = `pi-${node.localName}-default`;
    return node;
  },
  Form: function(el, isPreview) {
    var node = returnDOM(`
  <form onsubmit="FormErrorExplaination(event)" action="#">
    <div class="pc-div-dcqg2">
      <input type="text" placeholder="Username" class="pc-input-fq1uq">
      <input type="password" placeholder="Password" class="pc-input-p6s9i">
      <button class="pc-button-5leeh">Submit</button>
      </div>
    </form>
      `);
    return node;
  },
  "Submit Button": function(el, isPreview) {
    var node = document.createElement("button");
    node.type = "submit";
    node.innerText = "Send";
    node.className = `pi-${node.localName}-default`;
    return node;
  },
  Circle: function(el, isPreview) {
    var node = document.createElement("div");
    node.className = "Xcircle";
    return node;
  }
};

var KeyStore = Object.keys(templates);
for (K in KeyStore) {
  const itms = window.parent.document.querySelector("#items");
  if(itms) {
    // تمرير true يمنع تماماً تشغيل الدوال الجانبية والمحرر أثناء إنشاء قائمة العناصر
    const X = templates[KeyStore[K]](document.createElement("div"), true);
    X.setAttribute("draggable-item", true);
    X.setAttribute("draggable", true);
    const c = returnDOM(`<div draggable="true" class="item" data-item="${KeyStore[K]}">
    ${X.outerHTML}
    <b class="item-lable">${KeyStore[K]}</b>
  </div>`);
    itms.appendChild(c);
  }
}
});

window.addEventListener("DOMEditor:Cancel",(e)=>{
if(!window.MediaNode?.src && window.MediaNode instanceof HTMLAudioElement) {
    MediaNode.parentElement.removeChild(MediaNode);
  }
  if((!window.MediaNode?.src && !window.MediaNode?.poster) && window.MediaNode instanceof HTMLVideoElement) {
    MediaNode.parentElement.removeChild(MediaNode);
  }
  if(window.MediaNode instanceof HTMLImageElement && !window.MediaNode?.src) {
    window.MediaNode.parentElement.removeChild(window.MediaNode);
  }
});

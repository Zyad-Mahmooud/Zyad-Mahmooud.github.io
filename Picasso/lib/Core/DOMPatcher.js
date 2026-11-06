window.addEventListener("load", () => {
  const program = document.querySelector("#DOMPatcher #program");
  
  // 🟢 دالة بث الأحداث الذكية لنظام Picasso بدون MutationObserver
  // تتولى التقاط الحالة، التحديث، وإخطار الـ Event Bus
  const updateProperty = (targetElement, prop, newValue, isAttribute = false) => {
    // 1. جلب القيمة القديمة بدقة بناءً على نوع الخصيصة (Property أو Attribute)
    let oldValue;
    if (isAttribute) {
      oldValue = targetElement.getAttribute(prop);
    } else {
      oldValue = targetElement[prop];
    }

    // 2. تطبيق التحديث اللحظي على الـ DOM الحقيقي
    if (isAttribute) {
      if (newValue !== null && newValue !== undefined && newValue !== '') {
        targetElement.setAttribute(prop, newValue);
      } else {
        targetElement.removeAttribute(prop);
      }
    } else {
      targetElement[prop] = newValue;
    }
    if(newValue.length == 0) {
        targetElement.removeAttribute(prop);
        if (window.parent && Array.isArray(window.parent.functionsList)) {
      window.parent.functionsList.forEach((fun) => {
        if (typeof fun === "function") {
          fun({
            type: "DOM",
            trigger: "property",
            subTrigger: "del",
            prop: prop,
            value: newValue,
            oldValue: oldValue,
            target: targetElement
          });
        }
      });
    }
      }
    // 3. إرسال الإشعار والتحية الصريحة إلى الـ Event Bus الخاص بـ window.parent
    if (window.parent && Array.isArray(window.parent.functionsList)) {
      window.parent.functionsList.forEach((fun) => {
        if (typeof fun === "function") {
          fun({
            type: "DOM",
            trigger: "property",
            prop: prop,
            value: newValue,
            oldValue: oldValue,
            target: targetElement
          });
        }
      });
    }
  };

  window.programs = {
    // Shared UI styles for the Shadow DOM panels
    _sharedStyle: `
      <style>
       
        .inspector-panel {
          font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
          background-color: #1e1e1e;
          color: #d4d4d4;
          padding: 16px;
          border-radius: 8px;
          box-shadow: 0 4px 12px rgba(0,0,0,0.3);
          max-width: 320px;
          border: 1px solid #3c3c3c;
        }
        
        .inspector-panel h3 {
          margin-top: 0;
          margin-bottom: 16px;
          font-size: 1.1rem;
          color: #4fc1ff;
          border-bottom: 1px solid #3c3c3c;
          padding-bottom: 8px;
          display: flex;
          align-items: center;
          gap: 6px;
        }

        .control-group {
          margin-bottom: 12px;
        }

        .inspector-panel label {
          display: block;
          font-size: 0.85rem;
          color: #aaaaaa;
          margin-bottom: 6px;
        }

        .inspector-panel input[type="text"],
        .inspector-panel select,
        .inspector-panel textarea {
          width: 100%;
          box-sizing: border-box;
          background-color: #2d2d2d;
          border: 1px solid #3c3c3c;
          color: #ffffff;
          padding: 6px 10px;
          border-radius: 4px;
          font-size: 0.9rem;
          transition: border-color 0.2s, box-shadow 0.2s;
        }

        .inspector-panel input[type="text"]:focus,
        .inspector-panel select:focus,
        .inspector-panel textarea:focus {
          outline: none;
          border-color: #007acc;
          box-shadow: 0 0 4px rgba(0, 122, 204, 0.5);
        }

        .checkbox-container {
          display: flex;
          gap: 16px;
          margin-top: 16px;
          padding-top: 12px;
          border-top: 1px dashed #3c3c3c;
          flex-wrap: wrap;
        }

        .checkbox-label {
          display: flex !important;
          align-items: center;
          gap: 6px;
          cursor: pointer;
          user-select: none;
          color: #d4d4d4 !important;
        }

        .checkbox-label input[type="checkbox"] {
          accent-color: #007acc;
          width: 16px;
          height: 16px;
          cursor: pointer;
        }

        .helper-text {
          font-size: 0.75rem;
          color: #888888;
          margin-top: 4px;
          display: block;
        }
      </style>
    `,

    div: function(targetElement) {
      if (!program) return;
      program.innerHTML = `
        ${programs._sharedStyle}
        <div class="inspector-panel">
          <h3><span>🛠️</span> Inspect DIV</h3>
          <div class="control-group">
            <label for="prop-text">Text Content (innerText):</label>
            <input type="text" id="prop-text" value="${targetElement.innerText || ''}" placeholder="Empty text...">
          </div>
        </div>
      `;
      
      program.querySelector("#prop-text").addEventListener("input", (e) => {
        updateProperty(targetElement, "innerText", e.target.value);
      });
    },
    button: function(targetElement) {
      if (!program) return;
      program.innerHTML = `
        ${programs._sharedStyle}
        <div class="inspector-panel">
          <h3><span>🛠️</span> Inspect Button</h3>
          <div class="control-group">
            <label for="prop-text">Text Content (innerText):</label>
            <input type="text" id="prop-text" value="${targetElement.innerText || ''}" placeholder="Empty text...">
          </div>
        </div>
      `;
      
      program.querySelector("#prop-text").addEventListener("input", (e) => {
        updateProperty(targetElement, "innerText", e.target.value);
      });
    },
    h1: function(targetElement) {
      if (!program) return;
      programs.div(targetElement);
      program.querySelector("h3").innerHTML = "<span>🛠️</span> Inspect H1";
    },
    h2: function(targetElement) { 
      if (!program) return;
      programs.h1(targetElement); 
      program.querySelector("h3").innerHTML = "<span>🛠️</span> Inspect H2"; 
    },
    h3: function(targetElement) { 
      if (!program) return;
      programs.h1(targetElement); 
      program.querySelector("h3").innerHTML = "<span>🛠️</span> Inspect H3"; 
    },
    h4: function(targetElement) { 
      if (!program) return;
      programs.h1(targetElement); 
      program.querySelector("h3").innerHTML = "<span>🛠️</span> Inspect H4"; 
    },
    h5: function(targetElement) { 
      if (!program) return;
      programs.h1(targetElement); 
      program.querySelector("h3").innerHTML = "<span>🛠️</span> Inspect H5"; 
    },
    h6: function(targetElement) { 
      if (!program) return;
      programs.h1(targetElement); 
      program.querySelector("h3").innerHTML = "<span>🛠️</span> Inspect H6"; 
    },
    span: function(targetElement) {
      if (!program) return;
      programs.h1(targetElement);
      program.querySelector("h3").innerHTML = "<span>🛠️</span> Inspect span";
    },
    p: function(targetElement) {
      if (!program) return;
      programs.h1(targetElement);
      program.querySelector("h3").innerHTML = "<span>🛠️</span> Inspect p";
    },
    
    // 🔽 واجهة التحكم لعنصر القائمة المنسدلة SELECT الجديدة
    select: function(targetElement) {
      if (!program) return;
      // تجميع الخيارات المتاحة داخل السيلكت لتحويلها لنص يمكن تعديله
      const optionsText = Array.from(targetElement.options).map(opt => opt.text).join("\n");

      program.innerHTML = `
        ${programs._sharedStyle}
        <div class="inspector-panel">
          <h3><span>🔽</span> Inspect Select</h3>
          
          <div class="control-group">
            <label for="prop-select-val">Selected Value:</label>
            <select id="prop-select-val">
              ${Array.from(targetElement.options).map(opt => `
                <option value="${opt.value}" ${opt.selected ? 'selected' : ''}>${opt.text}</option>
              `).join('')}
            </select>
          </div>

          <div class="control-group">
            <label for="prop-select-options">Options List (One per line):</label>
            <textarea id="prop-select-options" rows="4" placeholder="Option 1&#10;Option 2" style="font-family: monospace; resize: vertical;">${optionsText}</textarea>
            <span class="helper-text">Changing this will regenerate options</span>
          </div>

          <div class="checkbox-container">
            <label class="checkbox-label">
              <input type="checkbox" id="prop-select-disabled" ${targetElement.disabled ? 'checked' : ''}>
              <span>Disabled</span>
            </label>
            <label class="checkbox-label">
              <input type="checkbox" id="prop-select-multiple" ${targetElement.multiple ? 'checked' : ''}>
              <span>Multiple Select</span>
            </label>
          </div>
        </div>
      `;

      // تغيير القيمة المحددة حالياً
      program.querySelector("#prop-select-val").addEventListener("change", (e) => {
        updateProperty(targetElement, "value", e.target.value);
      });

      // تعديل الخيارات عبر الـ Textarea
      program.querySelector("#prop-select-options").addEventListener("input", (e) => {
        const lines = e.target.value.split('\n').filter(line => line.trim() !== '');
        
        // إفراغ الخيارات الحالية
        targetElement.innerHTML = '';
        
        // بناء الخيارات الجديدة
        lines.forEach(line => {
          const opt = document.createElement('option');
          opt.value = line.trim();
          opt.text = line.trim();
          targetElement.appendChild(opt);
        });

        // تحديث مظهر قائمة الـ Select الموجدة داخل لوحة التحكم نفسها لتعكس الخيارات الجديدة
        const controlSelect = program.querySelector("#prop-select-val");
        controlSelect.innerHTML = lines.map(line => `<option value="${line.trim()}">${line.trim()}</option>`).join('');
        
        // إخطار الـ Event Bus بتحديث الـ innerHTML بالكامل للسيلكت
        updateProperty(targetElement, "innerHTML", targetElement.innerHTML);
      });

      // تفعيل / تعطيل السيلكت
      program.querySelector("#prop-select-disabled").addEventListener("change", (e) => {
        updateProperty(targetElement, "disabled", e.target.checked);
      });

      // تحويلها لقائمة متعددة الخيارات
      program.querySelector("#prop-select-multiple").addEventListener("change", (e) => {
        updateProperty(targetElement, "multiple", e.target.checked);
      });
    },

    input: function(targetElement) {
      if (!program) return;
      program.innerHTML = `
        ${programs._sharedStyle}
        <div class="inspector-panel">
          <h3><span>🛠️</span> Inspect Input</h3>
          
          <div class="control-group">
            <label for="prop-value">Value</label>
            <input type="text" id="prop-value" value="${targetElement.value || ''}" placeholder="Type value...">
          </div>
          
          <div class="control-group">
            <label for="prop-placeholder">Placeholder</label>
            <input type="text" id="prop-placeholder" value="${targetElement.placeholder || ''}" placeholder="e.g. Enter name...">
          </div>
          
          <div class="control-group">
            <label for="prop-type">Type</label>
            <select id="prop-type">
              <optgroup label="Text Inputs">
                <option value="text" ${targetElement.type === 'text' ? 'selected' : ''}>Text</option>
                <option value="password" ${targetElement.type === 'password' ? 'selected' : ''}>Password</option>
                <option value="email" ${targetElement.type === 'email' ? 'selected' : ''}>Email</option>
                <option value="url" ${targetElement.type === 'url' ? 'selected' : ''}>URL</option>
                <option value="search" ${targetElement.type === 'search' ? 'selected' : ''}>Search</option>
                <option value="tel" ${targetElement.type === 'tel' ? 'selected' : ''}>Tel (Phone)</option>
              </optgroup>
              <optgroup label="Numeric & Controls">
                <option value="number" ${targetElement.type === 'number' ? 'selected' : ''}>Number</option>
                <option value="range" ${targetElement.type === 'range' ? 'selected' : ''}>Range (Slider)</option>
                <option value="checkbox" ${targetElement.type === 'checkbox' ? 'selected' : ''}>Checkbox</option>
                <option value="radio" ${targetElement.type === 'radio' ? 'selected' : ''}>Radio Button</option>
              </optgroup>
              <optgroup label="Date & Time">
                <option value="date" ${targetElement.type === 'date' ? 'selected' : ''}>Date</option>
                <option value="time" ${targetElement.type === 'time' ? 'selected' : ''}>Time</option>
                <option value="datetime-local" ${targetElement.type === 'datetime-local' ? 'selected' : ''}>Datetime Local</option>
                <option value="month" ${targetElement.type === 'month' ? 'selected' : ''}>Month</option>
                <option value="week" ${targetElement.type === 'week' ? 'selected' : ''}>Week</option>
              </optgroup>
              <optgroup label="Special & Media">
                <option value="color" ${targetElement.type === 'color' ? 'selected' : ''}>Color Picker</option>
                <option value="file" ${targetElement.type === 'file' ? 'selected' : ''}>File Upload</option>
                <option value="image" ${targetElement.type === 'image' ? 'selected' : ''}>Image (Submit)</option>
                <option value="hidden" ${targetElement.type === 'hidden' ? 'selected' : ''}>Hidden</option>
              </optgroup>
              <optgroup label="Buttons">
                <option value="button" ${targetElement.type === 'button' ? 'selected' : ''}>Standard Button</option>
                <option value="submit" ${targetElement.type === 'submit' ? 'selected' : ''}>Submit Form</option>
                <option value="reset" ${targetElement.type === 'reset' ? 'selected' : ''}>Reset Form</option>
              </optgroup>
            </select>
          </div>

          <div class="checkbox-container">
            <label class="checkbox-label">
              <input type="checkbox" id="prop-disabled" ${targetElement.disabled ? 'checked' : ''}>
              <span>Disabled</span>
            </label>
            
            <label class="checkbox-label">
              <input type="checkbox" id="prop-required" ${targetElement.required ? 'checked' : ''}>
              <span>Required</span>
            </label>
          </div>
        </div>
      `;

      program.querySelector("#prop-value").addEventListener("input", (e) => updateProperty(targetElement, "value", e.target.value));
      program.querySelector("#prop-placeholder").addEventListener("input", (e) => updateProperty(targetElement, "placeholder", e.target.value));
      program.querySelector("#prop-type").addEventListener("change", (e) => updateProperty(targetElement, "type", e.target.value));
      program.querySelector("#prop-disabled").addEventListener("change", (e) => updateProperty(targetElement, "disabled", e.target.checked));
      program.querySelector("#prop-required").addEventListener("change", (e) => updateProperty(targetElement, "required", e.target.checked));
    },

    default: function(targetElement) {
      if (!program) return;
      program.innerHTML = `
        ${programs._sharedStyle}
        <div class="inspector-panel">
          <h3 style="color: #ffa500!important;"><span>⚠️</span> Not Supported</h3>
          <p style="font-size: 0.9rem; margin: 0;">Element <b style="color: #ff4500!important;">&lt;${targetElement.localName}&gt;</b> is not supported for inspection yet.</p>
        </div>
      `;
    },
    iframe: function(el) {
      if (!program) return;
      program.innerHTML = `
        ${programs._sharedStyle}
        <div class="inspector-panel">
          <h3><span>🖼️</span> Inspect Image</h3>
          <div class="control-group">
            <label>Image Source URL:</label>
            <input type="url" value="${el.src}" style="background: none;color: white;border-top: none;border-left: none;border-right: none;" placeholder="URL...">
            <br>
            <button style="width: 130px;color: black!important; border: none; margin-top:8px; cursor:pointer;" id="ImageUpload">Upload</button>
          </div>
        </div>
      `;
      program.querySelector(`input[placeholder="URL..."]`).addEventListener("input", (e) => {
        updateProperty(el, "src", e.target.value);
      });
      program.querySelector("#ImageUpload").addEventListener("click",()=>{
        var fileInput = document.createElement("input");
        fileInput.type = "file";
        fileInput.onchange = function() {
           updateProperty(el, "src", window.URL.createObjectURL(fileInput.files[0]));
        };
        fileInput.click();
      });
    },
    img: function(el) {
      if (!program) return;
      program.innerHTML = `
        ${programs._sharedStyle}
        <div class="inspector-panel">
          <h3><span>🖼️</span> Inspect Image</h3>
          <div class="control-group">
            <label>Image Source URL:</label>
            <input type="url" value="${el.src}" style="background: none;color: white;border-top: none;border-left: none;border-right: none;" placeholder="URL...">
            <br>
            <button style="width: 130px;color: black!important; border: none; margin-top:8px; cursor:pointer;" id="ImageUpload">Upload</button>
          </div>
        </div>
      `;
      program.querySelector(`input[placeholder="URL..."]`).addEventListener("input", (e) => {
        updateProperty(el, "src", e.target.value);
      });
      program.querySelector("#ImageUpload").addEventListener("click",()=>{
        var fileInput = document.createElement("input");
        fileInput.type = "file";
        fileInput.onchange = function() {
           updateProperty(el, "src", window.URL.createObjectURL(fileInput.files[0]));
        };
        fileInput.click();
      });
    },

    // 🔽 واجهة التحكم المحدثة والمحسنة للجدول TABLE
    table: function(targetElement) {
      if (!program) return;
      program.innerHTML = `
        ${programs._sharedStyle}
        <div class="inspector-panel">
          <h3><span>📊</span> Inspect TABLE</h3>
          
          <div class="control-group">
            <label for="prop-border">Table Border (px):</label>
            <input type="text" id="prop-border" value="${targetElement.getAttribute('border') || '0'}" placeholder="e.g. 1">
          </div>

          <div class="control-group">
            <label for="prop-cellpadding">Cell Padding:</label>
            <input type="text" id="prop-cellpadding" value="${targetElement.getAttribute('cellpadding') || ''}" placeholder="e.g. 8">
          </div>

          <div class="control-group">
            <label for="prop-cellspacing">Cell Spacing:</label>
            <input type="text" id="prop-cellspacing" value="${targetElement.getAttribute('cellspacing') || ''}" placeholder="e.g. 2">
          </div>

          <div class="control-group">
            <label for="prop-width">Width (% or px):</label>
            <input type="text" id="prop-width" value="${targetElement.getAttribute('width') || ''}" placeholder="e.g. 100%">
          </div>
        </div>
      `;

      program.querySelector("#prop-border").addEventListener("input", (e) => {
        updateProperty(targetElement, "border", e.target.value, true);
      });

      program.querySelector("#prop-cellpadding").addEventListener("input", (e) => {
        updateProperty(targetElement, "cellpadding", e.target.value, true);
      });

      program.querySelector("#prop-cellspacing").addEventListener("input", (e) => {
        updateProperty(targetElement, "cellspacing", e.target.value, true);
      });

      program.querySelector("#prop-width").addEventListener("input", (e) => {
        updateProperty(targetElement, "width", e.target.value, true);
      });
    },
    tr: function(targetElement) {
      if (!program) return;
      program.innerHTML = `
        ${programs._sharedStyle}
        <div class="inspector-panel">
          <h3><span>↔️</span> Inspect Table Row (TR)</h3>
          <p style="font-size: 0.85rem; color: #aaaaaa; margin-bottom: 12px;">Row element acts as a container for cells.</p>
          
          <div class="control-group">
            <label for="prop-tr-align">Text Align (Row):</label>
            <select id="prop-tr-align">
              <option value="" ${!targetElement.getAttribute('align') ? 'selected' : ''}>Default</option>
              <option value="left" ${targetElement.getAttribute('align') === 'left' ? 'selected' : ''}>Left</option>
              <option value="center" ${targetElement.getAttribute('align') === 'center' ? 'selected' : ''}>Center</option>
              <option value="right" ${targetElement.getAttribute('align') === 'right' ? 'selected' : ''}>Right</option>
            </select>
          </div>
        </div>
      `;
      program.querySelector("#prop-tr-align").addEventListener("change", (e) => {
        updateProperty(targetElement, "align", e.target.value, true);
      });
    },
    td: function(targetElement) {
      if (!program) return;
      program.innerHTML = `
        ${programs._sharedStyle}
        <div class="inspector-panel">
          <h3><span>🔲</span> Inspect Table Cell (TD)</h3>
          
          <div class="control-group">
            <label for="prop-text">Cell Content (innerText):</label>
            <input type="text" id="prop-text" value="${targetElement.innerText || ''}" placeholder="Cell text...">
          </div>

          <div class="control-group">
            <label for="prop-colspan">Column Span (colspan):</label>
            <input type="text" id="prop-colspan" value="${targetElement.getAttribute('colspan') || ''}" placeholder="1">
          </div>
        </div>
      `;

      program.querySelector("#prop-text").addEventListener("input", (e) => {
        updateProperty(targetElement, "innerText", e.target.value);
      });

      program.querySelector("#prop-colspan").addEventListener("input", (e) => {
        updateProperty(targetElement, "colspan", e.target.value, true);
      });
    }
  };
  if(typeof onChange == "function") {
    onChange(function(event) {
      if(event.type == "click") {
        const target = event.event.target;
         if(!target.matches("[data-function]")) {
           if(typeof programs[target.localName] == "function") {
             programs[target.localName](target);
           } else {
             programs.default(target);
           }
         }
      }
    });
  }
});
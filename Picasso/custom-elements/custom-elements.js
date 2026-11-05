class HTMLAvancedRangeInput extends HTMLElement {
  constructor() {
    super();
  }

  connectedCallback() {
    const rangeTag = this;
const EV = (v) => {
    if (typeof window[oninputAttr.split("(")[0]] === "function") {
        window[oninputAttr.split("(")[0]](v); // v هنا كائن مباشر
    }
};
    // Read attributes safely from the custom element itself
    const min = rangeTag.getAttribute("min") || "0";
    const max = rangeTag.getAttribute("max") || "100";
    const property = rangeTag.getAttribute("prop");
    const text = rangeTag.getAttribute("title");
    const oninputAttr = rangeTag.getAttribute("oninput") || "";
    const Selunit = rangeTag.getAttribute("unit") || "";
    const value = rangeTag.getAttribute("value") || "";

    // Event Handler helper function

    // Create the range container
    const rangeContainer = document.createElement('div');
    rangeContainer.className = 'range';
    
    // Create the HTML structure
    rangeContainer.innerHTML = `
      <h4 class="range-title golden-text">${(text || property) || "untitled"}</h4>
      <br><br>
      <input unit="${Selunit}" value="${value}" prop="${property}" min="${min}" max="${max}" type="range">
      <div class="range-settings">
        <input unit="${Selunit}" class="txy" placeholder="min" type="number" value="${min}">
        <input unit="${Selunit}" class="txy" placeholder="max" type="number" value="${max}">
        <input unit="${Selunit}" class="txy txy-value" prop="${property}" placeholder="value" disabled type="text" value="${value ? value + Selunit : ""}">
        <select unit="${Selunit}" prop="${property}" class="unit">
          <option></option>
          <!-- Absolute Units -->
          <optgroup label="Absolute Units">
              <option>px</option><option>in</option><option>cm</option><option>mm</option><option>pt</option><option>pc</option>
          </optgroup>
          <!-- Relative Font Units -->
          <optgroup label="Relative Font Units">
              <option>em</option><option>rem</option><option>ex</option><option>rex</option><option>ch</option><option>rch</option><option>cap</option><option>rcap</option><option>lh</option><option>rlh</option><option>ic</option><option>ric</option>
          </optgroup>
          <!-- Viewport Units -->
          <optgroup label="Viewport Units">
              <option>vw</option><option>vh</option><option>svw</option><option>svh</option><option>lvw</option><option>lvh</option><option>dvw</option><option>dvh</option><option>vmin</option><option>vmax</option><option>vi</option><option>vb</option>
          </optgroup>
          <!-- Percentage & Grid -->
          <optgroup label="Percentage & Grid">
              <option>%</option><option>fr</option>
          </optgroup>
          <!-- Angle Units -->
          <optgroup label="Angle Units">
              <option>deg</option><option>grad</option><option>rad</option><option>turn</option>
          </optgroup>
          <!-- Time Units -->
          <optgroup label="Time Units">
              <option>s</option><option>ms</option>
          </optgroup>
          <!-- Frequency Units -->
          <optgroup label="Frequency Units">
              <option>Hz</option><option>kHz</option>
          </optgroup>
          <!-- Resolution Units -->
          <optgroup label="Resolution Units">
              <option>dpi</option><option>dpcm</option><option>dppx</option><option>x</option>
          </optgroup>
        </select>
        <input type="text" placeholder="custom">
      </div>
    `;

    // Replace the custom element's tag content or insert the container inside it
    // If you want the component to replace itself, use rangeTag.parentNode.replaceChild...
    rangeTag.appendChild(rangeContainer);

    // Get element references
    const rangeInput = rangeContainer.querySelector('input[type="range"]');
    const valueInput = rangeContainer.querySelector('input[placeholder="value"]');
    const unitSelect = rangeContainer.querySelector('.unit');
    const minInput = rangeContainer.querySelector('input[placeholder="min"]');
    const maxInput = rangeContainer.querySelector('input[placeholder="max"]');
    const custom = rangeContainer.querySelector('input[placeholder="custom"]');

    unitSelect.value = Selunit;

    // Custom input listeners
    custom.addEventListener("input", () => {
      const propVal = rangeInput.getAttribute("prop");
      EV({
        value: custom.value,
        prop: propVal,
        supported: CSS.supports(propVal, custom.value),
        reference: rangeInput,
        trigger: "whileChange"
      });
      valueInput.value = custom.value;
    });

    custom.addEventListener("change", () => {
      const propVal = rangeInput.getAttribute("prop");
      EV({
        value: custom.value,
        prop: propVal,
        supported: CSS.supports(propVal, custom.value),
        reference: rangeInput,
        trigger: "afterChange"
      });
      valueInput.value = custom.value;
    });

    // Range input listeners
    rangeInput.addEventListener("input", (e) => {
      const Iv = e.target.value + unitSelect.value;
      const propVal = rangeInput.getAttribute("prop");
      EV({
        value: Iv,
        prop: propVal,
        supported: CSS.supports(propVal, Iv),
        reference: rangeInput,
        trigger: "whileChange"
      });
      valueInput.value = Iv;
      rangeContainer.value = Iv;
    });

    rangeInput.addEventListener("change", (e) => {
      const Iv = e.target.value + unitSelect.value;
      const propVal = rangeInput.getAttribute("prop");
      EV({
        value: Iv,
        prop: propVal,
        supported: CSS.supports(propVal, Iv),
        reference: rangeInput,
        trigger: "afterChange"
      });
      valueInput.value = Iv;
      rangeContainer.value = Iv;
    });

    rangeInput.addEventListener("pointerdown", (e) => {
      const Iv = e.target.value + unitSelect.value;
      const propVal = rangeInput.getAttribute("prop");
      EV({
        value: Iv,
        prop: propVal,
        supported: CSS.supports(propVal, Iv),
        reference: rangeInput,
        trigger: "beforeChange"
      });
      valueInput.value = Iv;
      rangeContainer.value = Iv;
    });

    unitSelect.addEventListener("change", () => {
      const Iv = rangeInput.value + unitSelect.value;
      const propVal = rangeInput.getAttribute("prop");
      window.Iv = Iv;
      EV({
        value: Iv,
        prop: propVal,
        supported: CSS.supports(propVal, Iv),
        reference: rangeInput,
        trigger: "afterChange"
      });
      valueInput.value = Iv;
    });

    minInput.addEventListener("input", (e) => {
      rangeInput.setAttribute("min", e.target.value);
    });

    maxInput.addEventListener("input", (e) => {
      rangeInput.setAttribute("max", e.target.value);
    });
  }
}

customElements.define("range-input", HTMLAvancedRangeInput);
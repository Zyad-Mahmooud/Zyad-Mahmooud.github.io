var CSSProps = {
    width: {
    	group: "Layout",
    	type: "range",
    	unit: "%",
    	title: "element width",
    	min: 0,
    	max: 100
    },
    height: {
    	group: "Layout",
    	type: "range",
    	title: "element height",
    	min: 0,
    	max: 100,
    	unit: "%"
    },
    minWidth: {
    	group: "Layout",
    	type: "range",
    	title: "minimum width"
    },
    minHeight: {
    	group: "Layout",
    	type: "range",
    	title: "minimum height"
    },
    maxWidth: {
    	group: "Layout",
    	type: "range",
    	title: "maximum width"
    },
    maxHeight: {
    	group: "Layout",
    	type: "range",
    	title: "maximum height"
    },
    flexShrinking: {
    	group: "Layout",
    	type: "range",
    	min: 0,
    	max: 100,
    	unit: "",
    	title: "flex shrink"
    },
    flexGrow: {
    	group: "Layout",
    	type: "range",
    	min: 0,
    	max: 100,
    	unit: "",
    	title: "flex grow"
    },
    flexBasis: {
    	group: "Layout",
    	type: "range",
    	min: 0,
    	max: 100,
    	unit: "",
    	title: "flex basis"
    },
    display: {
    	group: "Layout",
    	type: "select",
    	options: ["block","inline-block","flex","grid","none"],
    	title: "display type"
    },
    position: {
    	group: "Layout",
    	type: "select",
    	options: ["static","relative","absolute","fixed","sticky"],
    	title: "position type"
    },
    direction:{
    	group: "Layout",
    	type: "select",
    	options: ["rtl","ltr"],
    	title: "text direction"
    },
    top: {
    	group: "Layout",
    	type: "range",
    	title: "top offset"
    },
    right: {
    	group: "Layout",
    	type: "range",
    	title: "right offset"
    },
    bottom: {
    	group: "Layout",
    	type: "range",
    	title: "bottom offset"
    },
    left: {
    	group: "Layout",
    	type: "range",
    	title: "left offset"
    },
    margin: {
    	group: "Layout",
    	type: "range",
    	title: "margin (all sides)"
    },
    marginTop: {
    	group: "Layout",
    	type: "range",
    	title: "top margin"
    },
    marginRight: {
    	group: "Layout",
    	type: "range",
    	title: "right margin"
    },
    marginBottom: {
    	group: "Layout",
    	type: "range",
    	title: "bottom margin"
    },
    marginLeft: {
    	group: "Layout",
    	type: "range",
    	title: "left margin"
    },
    padding: {
    	group: "Layout",
    	type: "range",
    	title: "padding (all sides)"
    },
    zIndex: {
    	group: "Layout",
    	type: "range",
    	min: -2000,
    	max: 2000,
    	unit: "",
    	title: "stack order"
    },
    overflow: {
    	group: "Layout",
    	type: "select",
    	options: ["visible","hidden","scroll","auto"],
    	title: "overflow behavior"
    },
    overflowX: {
    	group: "Layout",
    	type: "select",
    	options: ["visible","hidden","scroll","auto"],
    	title: "horizontal overflow"
    },
    overflowY: {
    	group: "Layout",
    	type: "select",
    	options: ["visible","hidden","scroll","auto"],
    	title: "vertical overflow"
    },
    flexDirection: {
    	group: "Spacing",
    	type: "select",
    	options: ["row","row-reverse","column","column-reverse"],
    	title: "flex direction"
    },
    justifyContent: {
    	group: "Spacing",
    	type: "select",
    	options: ["flex-start","flex-end","center","space-between","space-around","space-evenly"],
    	title: "justify content"
    },
    justifyItems: {
    	group: "Spacing",
    	type: "select",
    	options: ["flex-start","flex-end","center","space-between","space-around","space-evenly"],
    	title: "justify items"
    },
    justifySelf: {
    	group: "Spacing",
    	type: "select",
    	options: ["flex-start","flex-end","center","space-between","space-around","space-evenly"],
    	title: "justify self"
    },
    alignItems: {
    	group: "Spacing",
    	type: "select",
    	options: ["flex-start","flex-end","center","stretch","baseline"],
    	title: "align items"
    },
    alignContent: {
    	group: "Spacing",
    	type: "select",
    	options: ["flex-start","flex-end","center","stretch","baseline"],
    	title: "align content"
    },
    alignSelf: {
    	group: "Spacing",
    	type: "select",
    	options: ["flex-start","flex-end","center","stretch","baseline"],
    	title: "align self"
    },
    placeSelf: {
    	group: "Spacing",
    	type: "select",
    	options: ["flex-start","flex-end","center","stretch","baseline"],
    	title: "place self"
    },
    gap: {
    	group: "Spacing",
    	type: "range",
    	title: "gap"
    },
    rowGap: {
    	group: "Spacing",
    	type: "range",
    	title: "row gap"
    },
    columnGap: {
    	group: "Spacing",
    	type: "range",
    	title: "column gap"
    },
    gridGap: {
    	group: "Spacing",
    	type: "range",
    	title: "grid gap"
    },
    gridRowGap: {
    	group: "Spacing",
    	type: "range",
    	title: "grid row gap"
    },
    gridColumnGap: {
    	group: "Spacing",
    	type: "range",
    	title: "grid column gap"
    },
    lineHeight:{
    	group:"Spacing",
    	type:"range",
    	title: "line height"
    },
    backgroundColor: {
    	group:"background",
    	type:"color",
    	title: "background color"
    },
    backgroundAttachment: {
    group: "background",
    type: "select",
    options: ["scroll", "fixed", "local"],
    title: "background attachment"
  },
    backgroundClip: {
    group: "background",
    type: "select",
    options: ["border-box", "padding-box", "content-box","text"],
    title: "background clip"
  },
    backgroundOrigin: {
    group: "background",
    type: "select",
    options: ["border-box", "padding-box", "content-box"],
    title: "background origin"
  },
    backgroundPosition: {
    group: "background",
    type: "select",
    options:["top","left","center","right","bottom"],
    title: "background position"
  },
    backgroundPositionX: {
    group: "background",
    type: "range",
    title: "background position X"
  },
    backgroundPositionY: {
    group: "background",
    type: "range",
    title: "background position Y"
  },
    backgroundRepeat: {
    group: "background",
    type: "select",
    options: ["repeat", "repeat-x", "repeat-y", "no-repeat", "space", "round"],
    title: "background repeat"
  },
    backgroundSize: {
    group: "background",
    type: "select",
    options: ["cover","contain","auto"],
    title: "background size"
  },
    border: {
    group: "border",
    type: "select",
    options: ["none","solid","dashed","dotted","double","groove","ridge","inset","outset","hidden"],
    title: "border style"
  },
    borderStyle: {
    group: "border",
    type: "select",
    options: ["none","solid","dashed","dotted","double","groove","ridge","inset","outset","hidden"],
    title: "border style"
  },
    borderWidth: {
    group: "border",
    type: "range",
    title: "border width"
  },
    borderColor: {
    group: "border",
    type: "color",
    title: "border color"
  },
    borderTop: {
    group: "border",
    type: "select",
    options: ["none","solid","dashed","dotted","double","groove","ridge","inset","outset","hidden"],
    title: "top border style"
  },
    borderRight: {
    group: "border",
    type: "select",
    options: ["none","solid","dashed","dotted","double","groove","ridge","inset","outset","hidden"],
    title: "right border style"
  },
    borderBottom: {
    group: "border",
    type: "select",
    options: ["none","solid","dashed","dotted","double","groove","ridge","inset","outset","hidden"],
    title: "bottom border style"
  },
    borderLeft: {
    group: "border",
    type: "select",
    options: ["none","solid","dashed","dotted","double","groove","ridge","inset","outset","hidden"],
    title: "left border style"
  },
    borderTopWidth: {
    group: "border",
    type: "range",
    title: "top border width"
  },
    borderRightWidth: {
    group: "border",
    type: "range",
    title: "right border width"
  },
    borderBottomWidth: {
    group: "border",
    type: "range",
    title: "bottom border width"
  },
    borderLeftWidth: {
    group: "border",
    type: "range",
    title: "left border width"
  },
    borderTopColor: {
    group: "border",
    type: "color",
    title: "top border color"
  },
    borderRightColor: {
    group: "border",
    type: "color",
    title: "right border color"
  },
    borderBottomColor: {
    group: "border",
    type: "color",
    title: "bottom border color"
  },
    borderLeftColor: {
    group: "border",
    type: "color",
    title: "left border color"
  },
    borderRadius: {
    group: "border",
    type: "range",
    title: "corner radius"
  },
    borderTopLeftRadius: {
    group: "border",
    type: "range",
    title: "top-left radius"
  },
    borderTopRightRadius: {
    group: "border",
    type: "range",
    title: "top-right radius"
  },
    borderBottomLeftRadius: {
    group: "border",
    type: "range",
    title: "bottom-left radius"
  },
    borderBottomRightRadius: {
    group: "border",
    type: "range",
    title: "bottom-right radius"
  },
    borderCollapse: {
    group: "border",
    type: "select",
    options: ["collapse","separate"],
    title: "border collapse"
  },
    borderSpacing: {
    group: "border",
    type: "range",
    title: "border spacing"
  },
    borderImage: {
    group: "border",
    type: "file",
    title: "border image"
  },
    borderImageSlice: {
    group: "border",
    type: "range",
    title: "border image slice"
  },
    borderImageWidth: {
    group: "border",
    type: "range",
    title: "border image width"
  },
    borderImageOutset: {
    group: "border",
    type: "range",
    title: "border image outset"
  },
    borderImageRepeat: {
    group: "border",
    type: "select",
    options: ["stretch","repeat","round","space"],
    title: "border image repeat"
  },
    cornerShape: {
    group: "border",
    type: "select",
    options: ["square","round","bevel","notch","scope","squircle"],
    title: "corner shape"
  },
    color: {
  	group:"Coloring",
  	type:"color",
  	title: "text color"
},
    fill: {
    group: "SVG",
    type: "color",
    title: "fill color"
  },
    fillOpacity: {
    group: "SVG",
    type: "range",
    min: 0,
    max: 1,
    step: 0.1,
    unit: "",
    title: "fill opacity"
  },
    fillRule: {
    group: "SVG",
    type: "select",
    options: ["nonzero", "evenodd"],
    title: "fill rule"
  },
    stroke: {
    group: "SVG",
    type: "color",
    title: "stroke color"
  },
    strokeWidth: {
    group: "SVG",
    type: "range",
    min: 0,
    max: 100,
    unit: "px",
    title: "stroke width"
  },
    strokeOpacity: {
    group: "SVG",
    type: "range",
    min: 0,
    max: 1,
    step: 0.1,
    unit: "",
    title: "stroke opacity"
  },
    strokeLinecap: {
    group: "SVG",
    type: "select",
    options: ["butt", "round", "square"],
    title: "stroke line cap"
  },
    strokeLinejoin: {
    group: "SVG",
    type: "select",
    options: ["miter", "round", "bevel"],
    title: "stroke line join"
  },
    strokeDasharray: {
    group: "SVG",
    type: "text", // تستقبل قيم مثل "5,5"
    title: "stroke dash pattern"
  },
    strokeDashoffset: {
    group: "SVG",
    type: "range",
    title: "stroke dash offset"
  },
    strokeMiterlimit: {
    group: "SVG",
    type: "range",
    min: 1,
    max: 20,
    title: "stroke miter limit"
  },
    stopColor: {
    group: "SVG",
    type: "color", // تستخدم في Gradients
    title: "gradient stop color"
  },
    stopOpacity: {
    group: "SVG",
    type: "range",
    min: 0,
    max: 1,
    step: 0.1,
    title: "gradient stop opacity"
  },
    shapeRendering: {
    group: "SVG",
    type: "select",
    options: ["auto", "optimizeSpeed", "crispEdges", "geometricPrecision"],
    title: "shape rendering"
  },
    vectorEffect: {
    group: "SVG",
    type: "select",
    options: ["none", "non-scaling-stroke"],
    title: "vector effect"
  },
    markerStart: {
    group: "SVG",
    type: "text",
    title: "start marker"
  },
    markerMid: {
    group: "SVG",
    type: "text",
    title: "mid marker"
  },
    markerEnd: {
    group: "SVG",
    type: "text",
    title: "end marker"
  },
    fontFamily: {
        group: "typography",
        type: "select",
        options: ["Arial","Verdana","Tahoma","Times New Roman","Georgia","Courier New","system-ui","serif","sans-serif","monospace","cursive"],
        title: "font family"
    },
    fontSize: {
        group: "typography",
        type: "range",
        title: "font size",
        min: 0,
        max: 160,
        unit: "px"
    },
    fontWeight: {
        group: "typography",
        type: "select",
        options: ["normal","bold","lighter","bolder","100","200","300","400","500","600","700","800","900"],
        title: "font weight"
    },
    fontStyle: {
        group: "typography",
        type: "select",
        options: ["normal","italic","oblique"],
        title: "font style"
    },
    fontVariant: {
        group: "typography",
        type: "select",
        options: ["normal","small-caps"],
        title: "font variant"
    },
    textTransform: {
        group: "typography",
        type: "select",
        options: ["none","capitalize","uppercase","lowercase"],
        title: "text transform"
    },
    textAlign: {
        group: "typography",
        type: "select",
        options: ["left","right","center","justify","start","end"],
        title: "text align"
    },
    letterSpacing: {
        group: "typography",
        type: "range",
        title: "letter spacing"
    },
    wordSpacing: {
        group: "typography",
        type: "range",
        title: "word spacing"
    },
    textDecorationLine: {
  group: "typography",
  type: "select",
  options: ["none", "underline", "overline", "line-through"],
  title: "decoration line"
},
    textDecorationStyle: {
  group: "typography",
  type: "select",
  options: ["solid", "double", "dotted", "dashed", "wavy"],
  title: "decoration line style"
},
    textDecorationColor: {
  group: "typography",
  type: "color",
  title: "decoration color"
},
    textDecorationThickness: {
  group: "typography",
  type: "range",
  min: 1,
  max: 10,
  step: 0.5,
  unit: "px",
  title: "decoration thickness"
},
    textUnderlineOffset: {
  group: "typography",
  type: "range",
  min: -10,
  max: 20,
  step: 1,
  unit: "px",
  title: "underline offset"
},
    textDecorationSkipInk: {
  group: "typography",
  type: "select",
  options: ["auto", "none", "all"],
  title: "decoration skip ink"
},
    whiteSpace: {
        group: "typography",
        type: "select",
        options: ["normal","nowrap","pre","pre-wrap","pre-line","break-spaces"],
        title: "white space handling"
    },
    wordBreak: {
        group: "typography",
        type: "select",
        options: ["normal","break-all","keep-all","break-word"],
        title: "word break"
    },
    overflowWrap: {
        group: "typography",
        type: "select",
        options: ["normal","anywhere","break-word"],
        title: "overflow wrap"
    },
    writingMode: {
        group: "typography",
        type: "select",
        options: ["horizontal-tb","vertical-rl","vertical-lr"],
        title: "writing mode"
    },
    opacity: {
    group: "effects",
    type: "range",
    title: "element opacity",
    min: 0,
    max: 100,
    unit: "%"
  },
    mixBlendMode: {
    group: "effects",
    type: "select",
    options: [
      "normal","multiply","screen","overlay","darken","lighten",
      "color-dodge","color-burn","difference","exclusion",
      "hue","saturation","color","luminosity"
    ],
    title: "blend mode"
  },
    transition: {
    group: "effects",
    type: "range",
    unit: "ms",
    title: "transition duration"
  },
    outlineStyle: {
    group: "Layout",
    type: "select",
    options: ["none","solid","dashed","dotted","double","groove","ridge","inset","outset","hidden"],
    title: "outline style"
  },
    outlineWidth: {
    group: "Layout",
    type: "range",
    title: "outline width"
  },
    outlineColor: {
    group: "Coloring",
    type: "color",
    title: "outline color"
  },
    outlineOffset: {
    group: "Layout",
    type: "range",
    title: "outline offset"
  },
    perspective: {
    group: "Layout",
    type: "range",
    title: "3D perspective"
  },
    objectFit: {
    group: "Image",
    type: "select",
    options: ["fill","contain","cover","none","scale-down"],
    title: "object fit"
  },
    imageRendering: {
    group: "Image",
    type: "select",
    options: ["auto","crisp-edges","pixelated"],
    title: "image rendering"
  },
    cursor: {
    group: "interaction",
    type: "select",
    options: ["default","pointer","move","text","wait","not-allowed","crosshair","zoom-in","zoom-out","grab","grabbing"],
    title: "cursor style"
  },
    pointerEvents: {
    group: "interaction",
    type: "select",
    options: ["auto","none"],
    title: "pointer events"
  },
    userSelect: {
    group: "interaction",
    type: "select",
    options: ["auto","none","text","all"],
    title: "text selection"
  },
    appearance: {
    group: "advanced",
    type: "select",
    options: [
  "auto",
  "none",
  "textfield",
  "button",
  "searchfield",
  "textarea",
  "menulist",
  "slider-horizontal",
  "checkbox",
  "radio",
  "listbox",
  "push-button",
  "square-button"
],
    title: "native appearance"
  },
    content: {
    group: "advanced",
    type: "text",
    title: "generated content"
  },
    _color: {
    type:"color",
    group: "typography",
    title: "font color"
  },
      gridColumnStart: {
    	group: "Layout",
    	type: "text", // أو range، لتمكين قيم مثل "span 2" أو رقم محدد
    	title: "grid column start"
    },
    gridColumnEnd: {
    	group: "Layout",
    	type: "text",
    	title: "grid column end"
    },
    gridRowStart: {
    	group: "Layout",
    	type: "text",
    	title: "grid row start"
    },
    gridRowEnd: {
    	group: "Layout",
    	type: "text",
    	title: "grid row end"
    },
    gridAutoFlow: {
    	group: "Layout",
    	type: "select",
    	options: ["row", "column", "dense", "row dense", "column dense"],
    	title: "grid auto flow"
    },
    boxSizing: {
    	group: "Layout",
    	type: "select",
    	options: ["border-box", "content-box"],
    	title: "box sizing"
    },
    isolation: {
    	group: "advanced",
    	type: "select",
    	options: ["auto", "isolate"],
    	title: "stacking isolation"
    },
    scrollSnapType: {
    	group: "interaction",
    	type: "select",
    	options: ["none", "x mandatory", "y mandatory", "both mandatory", "x proximity", "y proximity"],
    	title: "scroll snap type"
    },
    scrollSnapAlign: {
    	group: "interaction",
    	type: "select",
    	options: ["none", "start", "end", "center"],
    	title: "scroll snap align"
    },
    transitionProperty: {
    	group: "effects",
    	type: "text", // مثل: all, transform, opacity
    	title: "transition property"
    },
    transitionTimingFunction: {
    	group: "effects",
    	type: "select",
    	options: ["linear", "ease", "ease-in", "ease-out", "ease-in-out", "step-start", "step-end"],
    	title: "transition timing function"
    },
    transformOrigin: {
    	group: "effects",
    	type: "select",
    	options: ["center", "top", "bottom", "left", "right", "top left", "bottom right"],
    	title: "transform origin"
    },
    textOverflow: {
    	group: "typography",
    	type: "select",
    	options: ["clip", "ellipsis"], // أساسية جداً لقص النصوص الطويلة تلقائياً وتوليد الـ ...
    	title: "text overflow"
    },
    fontSmoothing: { 
    	group: "typography",
    	type: "select",
    	options: ["auto", "antialiased", "subpixel-antialiased"],
    	title: "font smoothing"
    },
    caretColor: {
    	group: "Coloring",
    	type: "color", // لتغيير لون مؤشر الكتابة الوامض داخل الـ Inputs
    	title: "caret color"
    },
    textJustify: {
    	group: "typography",
    	type: "select",
    	options: ["auto", "inter-word", "inter-character", "none"], // تضبط توزيع الكلام عند استخدام textAlign: "justify"
    	title: "text justify"
    },
    lineBreak: {
    	group: "typography",
    	type: "select",
    	options: ["auto", "loose", "normal", "strict", "anywhere"], // تمنع كسر السطر في أماكن غير مناسبة (مفيدة جداً للهويات متعددة اللغات)
    	title: "line break"
    },
    hyphens: {
    	group: "typography",
    	type: "select",
    	options: ["none", "manual", "auto"], // لتقسيم الكلمات الطويلة جداً بالشرطة (-) عند نهاية السطر تلقائياً
    	title: "hyphenation"
    },
    aspectRatio: {
    	group: "Layout",
    	type: "text", // يستقبل قيم بسيطة مثل "16/9" أو "1/1" أو "auto" - منقذ حقيقي لكروت الفيديو والصور لتظل متناسقة الأبعاد دائماً!
    	title: "aspect ratio"
    },
    float: {
    	group: "Layout",
    	type: "select",
    	options: ["none", "left", "right", "inline-start", "inline-end"], // رغم أنها قديمة، إلا أنها ما زالت تُستخدم لجعل النصوص تلتف حول الصور بشكل مجلاتي
    	title: "float"
    },
    clear: {
    	group: "Layout",
    	type: "select",
    	options: ["none", "left", "right", "both"],
    	title: "clear"
    },
    resize: {
    	group: "interaction",
    	type: "select",
    	options: ["none", "both", "horizontal", "vertical"], // تسمح للمستخدم بسحب زاوية العنصر لتكبيره يدوياً في المتصفح
    	title: "resize handle"
    },
    willChange: {
    	group: "advanced",
    	type: "select",
    	options: ["auto", "transform", "opacity", "scroll-position"], // خاصية أداء خارقة! تخبر الـ GPU أن هذا العنصر سيتحرك، فيقوم المتصفح بتهيئته برمجياً لمنع الـ Lag!
    	title: "performance hint (will-change)"
    },
    scrollBehavior: {
    	group: "interaction",
    	type: "select",
    	options: ["auto", "smooth"], // لجعل الانتقال بين أجزاء الصفحة ناعماً كالحرير عند الضغط على الأزرار
    	title: "scroll behavior"
    },
    colorInterpolation: {
    	group: "SVG",
    	type: "select",
    	options: ["auto", "sRGB", "linearRGB"], // تضبط دقة ونقاء خلط الألوان داخل الـ SVGs
    	title: "color interpolation"
    },
    _backgroundColor: {
      type: "color",
      group: "Coloring"
    },
    backgroundImage: {
      type: "file",
      group: "background"
    }
};

console.log(`There's around ${Object.keys(CSSProps).filter(prop => !String(prop).includes('_')).length} Property`);

/*
  __color: {
    type:"color",
    group: "typography"
  },
  ___color: {
    type:"color",
    group: "typography"
  },
  ____color: {
    type:"select",
    group: "typography",
    options:[
      1,
      2,
      3
      ]
  },

you can defne the same property Multiple times if you want to make it appear in multiple sections like Coloring,typography
*/

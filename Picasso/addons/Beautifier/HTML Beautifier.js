function Beautify(options) {
  const selfClosingTags = new Set([
    "area", "base", "br", "col", "embed", "hr", "img", 
    "input", "link", "meta", "source", "track", "wbr"
  ]);

  const inlineTags = new Set([
    "a", "abbr", "b", "bdi", "bdo", "br", "cite", "code", 
    "data", "dfn", "em", "i", "kbd", "mark", "q", "s", 
    "samp", "small", "span", "strong", "sub", "sup", 
    "time", "u", "var", "wbr"
  ]);

  const indentSize = options.indentSize;
  const indentChar = options.indentChar || " ";

  function getIndent(level) {
    return indentChar.repeat(indentSize * level);
  }

  function formatAttributes(node) {
    if (!node.attributes || node.attributes.length === 0) return "";
    
    const attrs = Array.from(node.attributes)
      .map(attr => `${attr.name}="${attr.value}"`)
      .join(" ");
    
    return " " + attrs;
  }

  function isWhitespaceOnly(text) {
    return /^\s*$/.test(text);
  }

  function hasOnlyInlineChildren(node) {
    return Array.from(node.childNodes).every(child => {
      if (child.nodeType === 3) return true; // Text nodes are inline
      if (child.nodeType === 1) {
        return inlineTags.has(child.tagName.toLowerCase());
      }
      return true;
    });
  }

  function processNode(node, level = 0) {
    const indent = getIndent(level);

    // Handle text nodes
    if (node.nodeType === 3) {
      const text = node.textContent;
      
      // Skip empty or whitespace-only text nodes
      if (isWhitespaceOnly(text)) {
        return "";
      }
      
      // Trim and preserve meaningful text
      return text.trim();
    }

    // Handle element nodes
    if (node.nodeType === 1) {
      const tagName = node.tagName.toLowerCase();
      const attrs = formatAttributes(node);

      // Handle self-closing tags
      if (selfClosingTags.has(tagName)) {
       return `${indent}<${tagName}${attrs}>`;
      }

      // Check if element has only inline content
      const hasOnlyInline = hasOnlyInlineChildren(node);
      
      // Process children
      const children = Array.from(node.childNodes);
      const processedChildren = children
        .map(child => processNode(child, level + 1))
        .filter(content => content !== "");

      // Handle empty elements
      if (processedChildren.length === 0) {
        return `${indent}<${tagName}${attrs}></${tagName}>`;
      }

      // Format based on content type
      if (hasOnlyInline && processedChildren.length === 1) {
        // Single inline content - keep on same line
        return `${indent}<${tagName}${attrs}>${processedChildren[0]}</${tagName}>`;
      } else if (hasOnlyInline) {
        // Multiple inline elements - keep on same line
        return `${indent}<${tagName}${attrs}>${processedChildren.join("")}</${tagName}>`;
      } else {
        // Block content - format with newlines
        const childContent = processedChildren
          .map(child => {
            // If child doesn't start with indent, it's inline text
            if (!child.startsWith(indentChar)) {
              return getIndent(level + 1) + child;
            }
            return child;
          })
          .join("\n");
        
        return `${indent}<${tagName}${attrs}>\n${childContent}\n${indent}</${tagName}>`;
      }
    }

    return "";
  }

  // Parse the HTML
  const parser = new DOMParser();
  const doc = parser.parseFromString(options.input, "text/html");

  // Process all children of body
  const result = Array.from(doc.body.childNodes)
    .map(node => processNode(node, 0))
    .filter(content => content !== "")
    .join("\n");

  // Output the result
  options.output(result);
}

// Example usage
/*
Beautify({
  input: `<div class="div-2563168"><input type="text"><p class="p-9965177">"The best way to predict the future is to create it."</p><span class="span-82672828">- Peter Drucker</span><br><div class="div-3711593"><p class="p-4764922">"The best way to predict the future is to create it."</p>
  <span class="span-82672828">- Peter Drucker</span><br>
<div class="div-1311494">
  <p class="p-6461402">"The best way to predict the future is to create it."</p>
  <span class="span-82672828">- Peter Drucker</span><br>
<div class="div-6958578">
  <p class="p-5639381">"The best way to predict the future is to create it."</p>
  <span class="span-82672828">- Peter Drucker</span><br>
<div class="div-8124648">
  <p class="p-6398257">"The best way to predict the future is to create it."</p>
  <span class="span-82672828">- Peter Drucker</span><br>
<div class="div-5558577">
  <p class="p-6048306">"The best way to predict the future is to create it."</p>
  <span class="span-82672828">- Peter Drucker</span><br>
</div></div></div></div></div></div>`,
  indentSize: 10,
  indentChar: " ",
  output: function(output) {
    console.log(output);
  }
});
*/
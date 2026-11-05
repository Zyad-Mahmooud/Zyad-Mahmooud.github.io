function insertSection(obj) {
let DOM = new DOMParser();
let Page = DOM.parseFromString(`<div class="part">
<div class="whitespace" style="margin-top:10px;">
<div class="topnav" onclick="display(this)" style="height:35px;">
	<b class="propTitle">${obj.title}</b>
</div>
</div>
<div class="carpet" id="${obj.title}">
	
</div>
</div>`,"text/html");
const tools = document.querySelector("#tools");
if(tools) {
tools.appendChild(Page.querySelector(".part"));
}
return Page.querySelector(".part");
}
window.parent.insertSection = insertSection;
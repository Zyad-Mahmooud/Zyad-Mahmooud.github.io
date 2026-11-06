function rem(el) {
  el.outerHTML = el.innerText; // إزالة span واستعادة النص الأصلي
}

function handleSelectionEnd() {
  const sel = window.getSelection();
  if (!sel || sel.rangeCount === 0) return;

  const range = sel.getRangeAt(0);
  if (range.collapsed) return; // مفيش تحديد

  // منع التداخل لو النص متغلف قبل كده
  if (range.startContainer.parentElement?.classList.contains("hightlight")) return;

  const span = document.createElement("span");
  span.className = `hightlight-${Math.floor(Math.random()*78929389293)}`;
  span.ondblclick = function () {
    rem(this);
  };

  try {
    range.surroundContents(span);
    sel.removeAllRanges(); // تنظيف التحديد
  } catch (e) {
    console.warn("Invalid selection range", e);
  }
}

// دعم الماوس
document.addEventListener("mouseup", (e) => handleSelectionEnd());

// دعم الكيبورد
document.addEventListener("keyup", (e) => {
  const keys = ["Shift", "ArrowLeft", "ArrowRight", "ArrowUp", "ArrowDown"];
  if (keys.includes(e.key)) handleSelectionEnd();
});

// دعم التاتش
document.addEventListener("touchend", (e) => handleSelectionEnd());

// fallback لو التحديد انهار
document.addEventListener("selectionchange", () => {
  const sel = window.getSelection();
  if (sel.isCollapsed) handleSelectionEnd();
});
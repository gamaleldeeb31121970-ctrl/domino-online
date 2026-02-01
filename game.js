
const hand = document.getElementById("hand");

for (let i = 0; i < 7; i++) {
  const d = document.createElement("div");
  d.className = "domino";
  enableDrag(d);
  hand.appendChild(d);
}

function enableDrag(el) {
  let offsetX = 0, offsetY = 0;

  el.addEventListener("pointerdown", e => {
    el.setPointerCapture(e.pointerId);
    const rect = el.getBoundingClientRect();
    offsetX = e.clientX - rect.left;
    offsetY = e.clientY - rect.top;
    el.style.position = "absolute";
    el.style.zIndex = 1000;
  });

  el.addEventListener("pointermove", e => {
    if (el.hasPointerCapture(e.pointerId)) {
      el.style.left = (e.clientX - offsetX) + "px";
      el.style.top = (e.clientY - offsetY) + "px";
    }
  });

  el.addEventListener("pointerup", e => {
    el.releasePointerCapture(e.pointerId);
  });
}

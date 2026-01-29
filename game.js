const domino = document.querySelector('.domino');

let dragging = false;
let startX = 0;
let startY = 0;
let rotX = 25;
let rotY = 30;

domino.addEventListener('touchstart', e => {
  dragging = true;
  startX = e.touches[0].clientX;
  startY = e.touches[0].clientY;
});

domino.addEventListener('touchmove', e => {
  if (!dragging) return;

  const x = e.touches[0].clientX;
  const y = e.touches[0].clientY;

  rotY += (x - startX) * 0.4;
  rotX -= (y - startY) * 0.4;

  domino.style.transform =
    `rotateX(${rotX}deg) rotateY(${rotY}deg)`;

  startX = x;
  startY = y;
});

domino.addEventListener('touchend', () => {
  dragging = false;
});

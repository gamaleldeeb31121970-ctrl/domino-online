let players = [];
let board = [];
let turn = 0;
let playerCount = 2;
let locked = false;

function generateDomino() {
  let d = [];
  for (let i = 0; i <= 6; i++)
    for (let j = i; j <= 6; j++)
      d.push({ l: i, r: j });
  return d.sort(() => Math.random() - 0.5);
}

function startGame(count) {
  playerCount = count;
  document.getElementById("menu").classList.add("hidden");
  document.getElementById("game").classList.remove("hidden");

  const domino = generateDomino();
  players = [];

  for (let i = 0; i < count; i++) {
    players.push({
      hand: domino.splice(0, 7),
      ai: i !== 0
    });
  }

  board = [];
  turn = 0;
  render();
}

function render() {
  document.getElementById("turn").innerText =
    players[turn].ai ? "الكمبيوتر" : "أنت";

  const boardDiv = document.getElementById("board");
  boardDiv.innerHTML = "";

  board.forEach(p => {
    let img = document.createElement("img");
    img.src = `assets/tiles/tile_${p.l}_${p.r}.png`;
    img.className = "piece";
    boardDiv.appendChild(img);
  });

  const handDiv = document.getElementById("hand");
  handDiv.innerHTML = "";

  players[0].hand.forEach((p, i) => {
    let img = document.createElement("img");
    img.src = `assets/tiles/tile_${p.l}_${p.r}.png`;
    img.className = "piece";
    img.onclick = () => play(i);
    handDiv.appendChild(img);
  });

  if (players[turn].ai) {
    setTimeout(aiPlay, 800);
  }
}

function play(i) {
  if (turn !== 0 || locked) return;
  locked = true;

  board.push(players[0].hand.splice(i, 1)[0]);
  nextTurn();
}

function aiPlay() {
  const ai = players[turn];
  if (ai.hand.length > 0) {
    board.push(ai.hand.shift());
  }
  nextTurn();
}

function nextTurn() {
  turn = (turn + 1) % playerCount;
  locked = false;
  render();
}

let playerId = "";
let roomId = "";
let myPieces = [];

// توليد الدومينو
function generateDomino() {
  const pieces = [];
  for (let i = 0; i <= 6; i++) {
    for (let j = i; j <= 6; j++) {
      pieces.push({ left: i, right: j });
    }
  }
  return shuffle(pieces);
}

function shuffle(arr) {
  return arr.sort(() => Math.random() - 0.5);
}

// دخول اللعبة
function joinGame() {
  const name = document.getElementById("playerName").value.trim();
  if (!name) return alert("اكتب اسمك");

  database.ref("rooms").once("value").then(snap => {
    let rooms = snap.val() || {};

    for (let id in rooms) {
      if (Object.keys(rooms[id].players).length < 4) {
        roomId = id;
        return joinRoom(name);
      }
    }

    // إنشاء غرفة جديدة
    roomId = "room_" + Date.now();
    createRoom(name);
  });
}

// إنشاء غرفة
function createRoom(name) {
  const domino = generateDomino();
  database.ref("rooms/" + roomId).set({
    board: [],
    turn: 0,
    domino: domino,
    players: {}
  });

  joinRoom(name);
}

// الانضمام
function joinRoom(name) {
  const playersRef = database.ref(`rooms/${roomId}/players`);

  playersRef.once("value").then(snap => {
    const count = snap.numChildren();
    playerId = "player" + count;

    const pieces = [];
    for (let i = 0; i < 7; i++) {
      pieces.push(database.ref(`rooms/${roomId}/domino`).get().then());
    }

    playersRef.child(playerId).set({
      name: name,
      pieces: []
    });

    startGame();
  });
}

// بدء اللعبة
function startGame() {
  document.getElementById("login").style.display = "none";
  document.getElementById("game").style.display = "block";
  document.getElementById("roomId").innerText = roomId;

  listenRoom();
}

// متابعة الغرفة
function listenRoom() {
  database.ref("rooms/" + roomId).on("value", snap => {
    const data = snap.val();
    if (!data) return;

    document.getElementById("turn").innerText = data.turn;
    renderBoard(data.board);

    const me = data.players[playerId];
    if (me) {
      myPieces = me.pieces || [];
      renderPieces();
    }
  });
}

// رسم الطاولة
function renderBoard(board) {
  const div = document.getElementById("board");
  div.innerHTML = "";
  board.forEach(p => {
    const img = document.createElement("img");
    img.src = `assets/tiles/tile_${p.left}_${p.right}.png`;
    img.className = "piece";
    div.appendChild(img);
  });
}

// رسم قطع اللاعب
function renderPieces() {
  const div = document.getElementById("pieces");
  div.innerHTML = "";
  myPieces.forEach((p, i) => {
    const img = document.createElement("img");
    img.src = `assets/tiles/tile_${p.left}_${p.right}.png`;
    img.className = "piece";
    img.onclick = () => playPiece(i);
    div.appendChild(img);
  });
}

// لعب قطعة
function playPiece(index) {
  const roomRef = database.ref("rooms/" + roomId);

  roomRef.once("value").then(snap => {
    const data = snap.val();
    if (data.turn !== playerId) return alert("مش دورك");

    const piece = myPieces[index];
    data.board.push(piece);
    myPieces.splice(index, 1);

    roomRef.child("players/" + playerId + "/pieces").set(myPieces);
    roomRef.child("board").set(data.board);

    const nextTurn =
      (parseInt(data.turn.replace("player", "")) + 1) %
      Object.keys(data.players).length;

    roomRef.child("turn").set("player" + nextTurn);
  });
}

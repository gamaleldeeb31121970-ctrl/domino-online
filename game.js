
let roomId = "";
let playerId = "";
let myPieces = [];

// توليد الدومينو
function generateDomino() {
  const pieces = [];
  for (let i = 0; i <= 6; i++) {
    for (let j = i; j <= 6; j++) {
      pieces.push({ left: i, right: j });
    }
  }
  return pieces.sort(() => Math.random() - 0.5);
}

function joinGame() {
  const name = document.getElementById("playerName").value.trim();
  if (!name) return alert("اكتب اسمك");

  const roomsRef = database.ref("rooms");

  roomsRef.once("value").then(snap => {
    const rooms = snap.val() || {};

    for (let id in rooms) {
      if (Object.keys(rooms[id].players).length < 4) {
        roomId = id;
        return joinRoom(name);
      }
    }

    // إنشاء غرفة جديدة
    roomId = "room_" + Date.now();
    const domino = generateDomino();

    database.ref("rooms/" + roomId).set({
      board: [],
      turn: 0,
      domino: domino,
      players: {}
    });

    joinRoom(name);
  });
}

function joinRoom(name) {
  const roomRef = database.ref("rooms/" + roomId);

  roomRef.once("value").then(snap => {
    const data = snap.val();
    const playerCount = Object.keys(data.players).length;

    playerId = "player" + playerCount;

    const myHand = data.domino.splice(0, 7);

    roomRef.child("players/" + playerId).set({
      name: name,
      pieces: myHand
    });

    roomRef.child("domino").set(data.domino);

    startGame();
  });
}

function startGame() {
  document.getElementById("login").style.display = "none";
  document.getElementById("game").style.display = "block";
  document.getElementById("roomId").innerText = roomId;

  listenRoom();
}

function listenRoom() {
  database.ref("rooms/" + roomId).on("value", snap => {
    const data = snap.val();
    if (!data) return;

    document.getElementById("turn").innerText = data.turn;

    renderBoard(data.board);

    if (data.players[playerId]) {
      myPieces = data.players[playerId].pieces;
      renderPieces();
    }
  });
}

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

function playPiece(index) {
  const roomRef = database.ref("rooms/" + roomId);

  roomRef.once("value").then(snap => {
    const data = snap.val();

    if (data.turn !== parseInt(playerId.replace("player", ""))) {
      return alert("مش دورك");
    }

    const piece = myPieces[index];
    data.board.push(piece);
    myPieces.splice(index, 1);

    roomRef.child("board").set(data.board);
    roomRef.child("players/" + playerId + "/pieces").set(myPieces);

    const nextTurn =
      (data.turn + 1) % Object.keys(data.players).length;

    roomRef.child("turn").set(nextTurn);
  });
}

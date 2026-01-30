
let playerId = '';
let roomId = '';
let playerPieces = [];

function generatePieces() {
  let pieces = [];
  for(let i=0;i<=6;i++){
    for(let j=i;j<=6;j++){
      pieces.push({left:i,right:j});
    }
  }
  return shuffle(pieces);
}

function shuffle(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
}

// دخول اللعبة مباشرة بعد كتابة الاسم
function joinGame() {
  const playerName = document.getElementById('playerName').value.trim();
  if(!playerName) return alert("اكتب اسمك");

  // البحث عن غرفة مفتوحة أو إنشاء غرفة جديدة
  database.ref('rooms').once('value').then(snapshot => {
    let rooms = snapshot.val() || {};
    let joined = false;

    for(let rId in rooms){
      let room = rooms[rId];
      if(Object.keys(room.players).length < 2){
        roomId = rId;
        playerId = 'player2';
        database.ref('rooms/' + roomId + '/players/' + playerId).set({name:playerName, pieces:[]});
        joined = true;
        break;
      }
    }

    if(!joined){
      roomId = 'room' + Date.now();
      playerId = 'player1';
      database.ref('rooms/' + roomId).set({
        players: { player1: {name:playerName, pieces:[]} },
        board: [],
        turn: 'player1'
      });
    }

    // عرض اللعبة بعد دخول اللاعب
    document.getElementById('roomIdDisplay').innerText = roomId;
    document.getElementById('login').style.display = 'none';
    document.getElementById('game').style.display = 'block';

    playerPieces = generatePieces().slice(0,7);
    renderPieces();
    listenBoard();
    listenTurn();
  }).catch(err => console.error("خطأ في الاتصال بقاعدة البيانات:", err));
}

function listenBoard() {
  const boardRef = database.ref('rooms/' + roomId + '/board');
  boardRef.on('value', snapshot => {
    const board = snapshot.val() || [];
    renderBoard(board);
  });
}

function listenTurn() {
  const turnRef = database.ref('rooms/' + roomId + '/turn');
  turnRef.on('value', snapshot => {
    document.getElementById('turnDisplay').innerText = snapshot.val();
  });
}

function renderBoard(board) {
  const boardDiv = document.getElementById('board');
  boardDiv.innerHTML = '';
  for (const pieceId in board) {
    const piece = board[pieceId];
    const img = document.createElement('img');
    img.className = 'piece';
    img.src = `assets/tiles/tile_${piece.left}_${piece.right}.png`;
    boardDiv.appendChild(img);
  }
}

function renderPieces() {
  const piecesDiv = document.getElementById('pieces');
  piecesDiv.innerHTML = '';
  playerPieces.forEach((p,index)=>{
    const img = document.createElement('img');
    img.className = 'piece';
    img.src = `assets/tiles/tile_${p.left}_${p.right}.png`;
    img.onclick = ()=>playPiece(index);
    piecesDiv.appendChild(img);
  });
}

function playPiece(index){
  const roomRef = database.ref('rooms/' + roomId);
  roomRef.child('turn').once('value').then(snapshot => {
    if(snapshot.val() !== playerId) return alert("ليس دورك بعد!");
    
    const piece = playerPieces[index];
    roomRef.child('board').push(piece);
    playerPieces.splice(index,1);
    renderPieces();

    roomRef.update({ turn: playerId === 'player1' ? 'player2' : 'player1' });
  }).catch(err => console.error("خطأ في اللعب:", err));
}

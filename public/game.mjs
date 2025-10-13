import Player from './Player.mjs';
import Collectible from './Collectible.mjs';

const canvas = document.getElementById('game-window');
const context = canvas.getContext('2d');
canvas.focus();

const canvasWidth = 640;
const canvasHeight = 480;
const upperCanvasHeight = 90;
const borderThickness = 5;

const COLORS = {
  BACKGROUND: '#272727',
  UI_BACKGROUND: 'black',
  UI_TEXT: 'white',
};

const borderGradient = context.createLinearGradient(0, upperCanvasHeight - borderThickness, 0, canvasHeight + upperCanvasHeight);
borderGradient.addColorStop(0, 'rgba(0, 0, 0, 0)');  
borderGradient.addColorStop(0.5, '#272727');           
borderGradient.addColorStop(1, 'rgba(0, 0, 0, 0)');    

const PLAYER_SIZE = 30;
const COLLECTIBLE_SIZE = 30;
const PLAYER_SPEED = 350;

const playerImage = new Image();
playerImage.src = 'https://raw.githubusercontent.com/Supravisor/boilerplate-project-secure-real-time-multiplayer-game/refs/heads/main/public/main-player.png';

const collectibleImage = new Collectible(1,2,1,3).image();

canvas.width = canvasWidth;
canvas.height = canvasHeight + upperCanvasHeight;

const player = new Player(300, 300, 0, 1);

const collectibles = [];
const desiredCollectibleCount = 1;

const keys = {};

const socket = io();
const players = {};
const playerId = socket.id;

window.addEventListener('keydown', (event) => {
  keys[event.key] = true;
});

window.addEventListener('keyup', (event) => {
  keys[event.key] = false;
});

socket.on('playerMoved', (movementData) => {
  if (players[movementData.playerId]) {
    players[movementData.playerId].x = movementData.x;
    players[movementData.playerId].y = movementData.y;
  } else {
    players[movementData.playerId] = movementData;
  }
});

socket.on('playerDisconnected', (disconnectedPlayerId) => {
  delete players[disconnectedPlayerId];
});

function loop(time) {
  const frame = (time - lastTime) / 1000;
  lastTime = time;

  updatePlayerPosition(frame);
    const collectiblesToRemove = [];

  collectibles.forEach((collectible, index) => {
    if (
      player.x < collectible.x + collectible.width &&
      player.x + PLAYER_SIZE > collectible.x &&
      player.y < collectible.y + collectible.height &&
      player.y + PLAYER_SIZE > collectible.y
    ) {
      collectiblesToRemove.push(index);
    }
  });

  if (collectiblesToRemove.length > 0) {
    player.id = `${collectibles.length - collectiblesToRemove.length + 1}`;

    collectiblesToRemove.forEach((index) => {
      player.score++;
      collectibles.splice(index, 1);
    });
  }

  while (collectibles.length < desiredCollectibleCount) {
    const newCollectiblePos = generateRandomCollectiblePosition();
    collectibles.push({ x: newCollectiblePos.x, y: newCollectiblePos.y, width: 30, height: 30 });
  }
  drawGame();

  requestAnimationFrame(loop);
}

function drawGame() {
  clearCanvas();
  drawArena();
  drawUI();
  drawBorder();
  drawPlayer();
  drawOtherPlayers();
  drawCollectibles();
}

function clearCanvas() {
  context.clearRect(0, 0, canvas.width, canvas.height);
}

function drawArena() {
  context.fillStyle = COLORS.BACKGROUND;
  context.fillRect(0, upperCanvasHeight, canvas.width, canvasHeight);
}

function drawUI() {
  context.fillStyle = COLORS.UI_BACKGROUND;
  context.fillRect(0, 0, canvas.width, upperCanvasHeight);

  context.fillStyle = COLORS.UI_TEXT;
  context.font = '20px "xxxx", Monospace';
  context.fillText(`Rank ${player.id}/${Object.keys(players).length + 1}`, 480, 70);
  context.fillText(`Score:`, 480, 35);
  context.fillText(`${player.score}`, 590, 35);
  context.fillText('Controls: WASD /', 10, 35);
  context.fillText('Arrow', 115, 70);
  context.font = '30px "xxxx", Arial';
  context.fillText('Collect Them', 240, 55);
}

function drawPlayer() {
  context.drawImage(playerImage, player.x, player.y, PLAYER_SIZE, PLAYER_SIZE);
}

function drawCollectibles() {
  collectibles.forEach(collectible => {
    context.drawImage(collectibleImage, collectible.x, collectible.y, collectible.width, collectible.height);
  });
}
function drawBorder() {
  context.fillStyle = 'black';
  context.fillRect(0, upperCanvasHeight - borderThickness, canvas.width, borderThickness);

  context.fillRect(0, upperCanvasHeight, borderThickness, canvasHeight);

  context.fillRect(canvasWidth - borderThickness, upperCanvasHeight, borderThickness, canvasHeight);

  context.fillRect(0, canvasHeight + upperCanvasHeight - borderThickness, canvas.width, borderThickness);
}

function updatePlayerPosition(frame) {
  if (keys['ArrowLeft'] || keys['a']) {
    if (player.x - PLAYER_SPEED * frame > borderThickness) {
      player.x -= PLAYER_SPEED * frame;
    }
  }

  if (keys['ArrowRight'] || keys['d']) {
    if (player.x + PLAYER_SIZE + PLAYER_SPEED * frame < canvasWidth - borderThickness) {
      player.x += PLAYER_SPEED * frame;
    }
  }
  if (keys['ArrowUp'] || keys['w']) {
    if (player.y - PLAYER_SPEED * frame > upperCanvasHeight + borderThickness) {
      player.y -= PLAYER_SPEED * frame;
    }
  }
  if (keys['ArrowDown'] || keys['s']) {
    if (player.y + PLAYER_SIZE + PLAYER_SPEED * frame < canvasHeight + upperCanvasHeight - borderThickness) {
      player.y += PLAYER_SPEED * frame;
    }
  }
   socket.emit('playerMoved', { x: player.x, y: player.y });
}

let colours = ["red", "green", "blue", "white", "yellow", "cyan", "magenta"]

function drawOtherPlayers() {
  let cols = 0;
  for (const playerId in players) {
    if (playerId !== socket.id) {

      const otherPlayer = players[playerId];
      context.fillStyle = colours[cols++];
      context.fillRect(otherPlayer.x, otherPlayer.y, PLAYER_SIZE, PLAYER_SIZE);
    }
  }
}

function generateRandomCollectiblePosition() {
  const minX = borderThickness;
  const maxX = canvasWidth - borderThickness - COLLECTIBLE_SIZE;
  const minY = upperCanvasHeight + borderThickness;
  const maxY = canvasHeight + upperCanvasHeight - borderThickness - COLLECTIBLE_SIZE;
  const randomX = Math.random() * (maxX - minX) + minX;
  const randomY = Math.random() * (maxY - minY) + minY;

  return { x: randomX, y: randomY };
}

let lastTime = 0;
requestAnimationFrame(loop);

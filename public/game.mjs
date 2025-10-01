import Player from './Player.mjs';
import Collectible from './Collectible.mjs';

const socket = io();
const canvas = document.getElementById('game-window');
const context = canvas.getContext('2d');

const loadImage = src => {
  const img = new Image();
  img.src = src;
  return img;
}

const bronzeCoinArt = loadImage('https://cdn.freecodecamp.org/demo-projects/images/bronze-coin.png');
const silverCoinArt = loadImage('https://cdn.freecodecamp.org/demo-projects/images/silver-coin.png');
const goldCoinArt = loadImage('https://cdn.freecodecamp.org/demo-projects/images/gold-coin.png');
const mainPlayerArt = loadImage('https://cdn.freecodecamp.org/demo-projects/images/main-player.png');
const otherPlayerArt = loadImage('https://cdn.freecodecamp.org/demo-projects/images/other-player.png');

let tick;
let currPlayers = [];
let item;
let endGame;


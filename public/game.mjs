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

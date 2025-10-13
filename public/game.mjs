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

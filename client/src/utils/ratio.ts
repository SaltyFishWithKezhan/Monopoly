const DESIGN_WIDTH = 1920;

let virtualWidth = window.innerWidth * window.devicePixelRatio;
let virtualHeight = window.innerHeight * window.devicePixelRatio;

let gameWidth = virtualWidth;
let gameHeight = virtualHeight;

if (virtualWidth / 16 > virtualHeight / 9) {
  gameHeight = (gameWidth * 9) / 16;
} else {
  gameWidth = (gameHeight * 16) / 9;
}

export {gameHeight, gameWidth};

export const ratio = gameWidth / DESIGN_WIDTH;

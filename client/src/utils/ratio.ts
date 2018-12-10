const DESIGN_WIDTH = 1920;

let virtualWidth = document.body.clientWidth;
let virtualHeight = document.body.clientHeight;

let gameWidth = virtualWidth;
let gameHeight = virtualHeight;

if (virtualWidth / 16 > virtualHeight / 9) {
  gameWidth = (gameHeight * 16) / 9;
} else {
  gameHeight = (gameWidth * 9) / 16;
}

export {gameHeight, gameWidth};

export const ratio = gameWidth / DESIGN_WIDTH;

export function height(vHeight: number): number {
  return gameHeight * vHeight;
}

export function width(vWidth: number): number {
  return gameWidth * vWidth;
}

import {GameObjects} from 'phaser';

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
  return (gameHeight * vHeight) / 100;
}

export function width(vWidth: number): number {
  return (gameWidth * vWidth) / 100;
}

export function scale(sRatio: number): number {
  return sRatio * ratio;
}

export function scaleGameObject(
  obj: GameObjects.Components.Transform,
  x?: number,
  y?: number,
): void {
  if (typeof x === 'undefined') {
    x = 1;
    y = 1;
  } else if (typeof y === 'undefined') {
    y = x;
  }

  obj.setScale(x * ratio, y * ratio);
}

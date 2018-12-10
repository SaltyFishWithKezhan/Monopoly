import {Game} from 'phaser';

import {BoardScene, LoginScene} from './scenes';
import {gameHeight, gameWidth} from './utils/ratio';

let config: GameConfig = {
  type: Phaser.CANVAS,
  width: gameWidth,
  height: gameHeight,
  backgroundColor: 0x87cefa,
  physics: {
    default: 'arcade',
    arcade: {
      gravity: {y: 200},
    },
  },
  canvas: document.getElementById('game') as HTMLCanvasElement,
};

let game = new Game(config);

game.scene.add('LoginScene', new LoginScene());
game.scene.add('BoardScene', new BoardScene());

game.scene.start('LoginScene');

export {game};

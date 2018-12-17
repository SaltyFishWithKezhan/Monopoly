import 'babel-polyfill';

import {Game} from 'phaser';

import {BoardScene, EnterLoadingScene, LoginScene, RoomScene} from './scenes';
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

game.scene.add('EnterLoadingScene', new EnterLoadingScene());
game.scene.add('LoginScene', new LoginScene());
game.scene.add('RoomScene', new RoomScene());
game.scene.add('BoardScene', new BoardScene());

game.scene.start('BoardScene');

export {game};

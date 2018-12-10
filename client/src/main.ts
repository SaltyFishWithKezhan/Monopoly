import {Game} from 'phaser';

import {LoginScene} from './scenes/login-scene';
import {gameHeight, gameWidth} from './utils/ratio';

let config: GameConfig = {
  type: Phaser.AUTO,
  width: gameWidth,
  height: gameHeight,
  physics: {
    default: 'arcade',
    arcade: {
      gravity: {y: 200},
    },
  },
};

let game = new Game(config);

game.scene.add('LoginScene', new LoginScene());

game.scene.start('LoginScene');

export {game};

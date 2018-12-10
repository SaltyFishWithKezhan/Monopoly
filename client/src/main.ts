import {Game} from 'phaser';

import {LoginScene} from './scenes/login-scene';

let config: GameConfig = {
  type: Phaser.AUTO,
  width: window.screen.availWidth / window.devicePixelRatio,
  height: window.screen.availHeight / window.devicePixelRatio,
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

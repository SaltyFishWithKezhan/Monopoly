import $ from 'jquery';
import {Scene} from 'phaser';

import {gameHeight, gameWidth, ratio} from '../../utils/ratio';

import './style.less';

export class LoginScene extends Scene {
  constructor() {
    super({key: 'LoginScene'});
  }

  preload(): void {
    this.load.image('lg-bg', 'assets/lg-bg.jpg');
  }

  create(): void {
    this.events.on('destroy', this.onSceneDestroy);
    this.createLoginForm();
    this.createScene();
  }

  private createScene(): void {
    let bgImage = this.add.image(gameWidth / 2, gameHeight / 2, 'lg-bg');

    bgImage.scaleX = ratio;
    bgImage.scaleY = ratio;
  }

  private createLoginForm(): void {
    $('#game-playground').append(
      `<div id="login-form-div" class="login-form-div" style="margin-left: ${gameWidth *
        0.3}px; width: ${gameWidth * 0.3}px; height: ${gameHeight *
        0.6}px;">haha</div>`,
    );
  }

  private onSceneDestroy = (): void => {
    this.destroyLoginForm();
  };

  private destroyLoginForm(): void {
    $('#login-form-div').remove();
  }
}

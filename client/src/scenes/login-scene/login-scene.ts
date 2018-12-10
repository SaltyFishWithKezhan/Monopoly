import 'animate.css';

import $ from 'jquery';
import {Scene} from 'phaser';

import {gameHeight, gameWidth, height, ratio, width} from '../../utils/ratio';

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
    if ($('#login-form-div').length) {
      $('#login-form-div').remove();
    }

    $('#game-playground').append(
      `<div
        id="login-form-div"
        class="login-form-div"
        style="margin-left: ${width(0.25)}px;
              margin-top: ${height(0.06)}px;
              width: ${width(0.3)}px;
              height: ${height(0.6)}px;"
      >
        <div class="logo animated bounceIn" style="width: ${width(
          0.33,
        )}px; left: -${width(0.001)}px; top: -${height(0.2)}px">
          <img src="/assets/logo.png" />
        </div>
        <div class="text-player" style="margin-top: ${height(
          0.16,
        )}px; width: ${width(0.07)}px; height: ${width(0.07 * 0.5)}px;">
            <img src="/assets/lg-text-player.png"/>
        </div>
        <input id="login-player" type="text" placeholder="您的名字" style="margin-top: ${height(
          0.055,
        )}px; height: ${height(0.06)}px; line-height: ${height(
        0.08,
      )}px; font-size: ${height(0.03)}px;" />
        <button id="login-join-btn" style="margin-top: ${height(
          0.04,
        )}px; width: ${height(0.155)}px; height: ${height(0.155 * 0.6)}px;" />
      </div>`,
    );
  }

  private onSceneDestroy = (): void => {
    this.destroyLoginForm();
  };

  private destroyLoginForm(): void {
    $('#login-form-div').remove();
  }
}

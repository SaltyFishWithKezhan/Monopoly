import 'animate.css';

import $ from 'jquery';
import {Scene} from 'phaser';

import {playerService} from '../../service-entrances';
import {
  gameHeight,
  gameWidth,
  height,
  ratio,
  scaleGameObject,
  width,
} from '../../utils/ratio';

import './style.less';

export class RoomScene extends Scene {
  constructor() {
    super({key: 'RoomScene'});
  }

  init(data: {}): void {
    console.log('data: ', data);

    if (playerService.player == null) {
      alert('你不应该出现在这里！！！');
      this.scene.switch('LoginScene');
    } else {
      console.log(playerService.player.id);
    }
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

    scaleGameObject(bgImage);
  }

  private createLoginForm(): void {
    if ($('#room-form-div').length) {
      return;
    }

    $('#game-playground').append(
      `<div
        id="room-form-div"
        class="room-form-div"
        style="margin-left: ${width(25)}px;
              margin-top: ${height(6)}px;
              width: ${width(30)}px;
              height: ${height(60)}px;"
      >
        <div class="logo animated bounceIn" style="width: ${width(
          40,
        )}px; left: -${width(5)}px; top: -${height(43)}px">
          <img src="/assets/logo.pn" />
        </div>
        <div class="text-player" style="margin-top: ${height(
          16,
        )}px; width: ${width(7)}px; height: ${width(7 * 0.5)}px;">
            <img src="/assets/lg-text-player.png"/>
        </div>
        <input id="login-player" type="text" placeholder="您的名字" style="margin-top: ${height(
          5.5,
        )}px; height: ${height(6)}px; line-height: ${height(
        8,
      )}px; font-size: ${height(3)}px;" />
        <button id="login-join-btn" style="margin-top: ${height(
          4,
        )}px; width: ${height(15.5)}px; height: ${height(15.5 * 0.6)}px;" />
      </div>`,
    );

    $('#login-join-btn').on('click', this.onLoginBtnClick);
  }

  private onSceneDestroy = (): void => {
    this.destroyLoginForm();
  };

  private onLoginBtnClick = (): void => {
    let name = $('#login-player').val() as string;

    playerService
      .login(name)
      .then(() => {
        // console.log('login success');
      })
      .catch(console.error);
  };

  private destroyLoginForm(): void {
    $('#login-form-div').remove();
  }
}

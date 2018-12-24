import 'animate.css';

import $ from 'jquery';
import {Scene} from 'phaser';

import {gameService, playerService, roomService} from '../../service-entrances';
import {
  gameHeight,
  gameWidth,
  height,
  scaleGameObject,
  width,
} from '../../utils/ratio';

import './style.less';

export class RoomScene extends Scene {
  constructor() {
    super({key: 'RoomScene'});
  }

  init(data: {}): void {
    console.info('in room scene data: ', data);

    if (!playerService.player) {
      alert('你不应该出现在这里！！！');
      this.scene.switch('LoginScene');
    } else {
      console.info('Current player id: ', playerService.player.id);
    }
  }

  preload(): void {
    this.load.image('lg-bg', 'assets/lg-bg.jpg');
  }

  create(): void {
    this.events.on('destroy', this.onSceneDestroy);
    this.events.on('sleep', this.onSceneDestroy);
    this.createLoginForm();
    this.createScene();
  }

  private createScene(): void {
    let bgImage = this.add.image(gameWidth / 2, gameHeight / 2, 'lg-bg');

    scaleGameObject(bgImage);
  }

  private createLoginForm(): void {
    if ($('.room-form-div').length) {
      return;
    }

    let player = playerService.player;

    if (!player) {
      throw new Error('Player not exists');
    }

    $('#game-playground').append(
      // right panel
      `<div
        id="room-form-div"
        class="room-form-div"
        style="margin-left: ${width(25)}px;
              margin-top: ${height(6)}px;
              width: ${width(30)}px;
              height: ${height(60)}px;"
      >
        <div class="text-player" style="margin-top: ${height(
          1,
        )}px; width: ${width(7)}px; height: ${width(7 * 0.5)}px;">
            <img src="/assets/lg-text-player.png"/>
        </div>
        <div id="room-player-list" style="height: ${height(
          40,
        )}px; margin-top: ${height(3)}px; width: ${width(20)}px">
        </div>
        <button id="start-game-btn" style="margin-top: ${height(
          4,
        )}px; width: ${height(15.5)}px; height: ${height(15.5 * 0.6)}px;" />
      </div>`,
      // left panel.
      `<div
        id="room-form-div"
        class="room-form-div"
        style="margin-left: -${width(25)}px;
              margin-top: ${height(6)}px;
              width: ${width(30)}px;
              height: ${height(60)}px;"
      >
        <div class="text-player" style="margin-top: ${height(
          1,
        )}px; width: ${width(7)}px; height: ${width(7 * 0.5)}px;">
            <img src="/assets/lg-text-player.png"/>
        </div>
        <input id="room-player" type="text" disabled placeholder="${
          player.id
        }" style="margin-top: ${height(5.5)}px; height: ${height(
        6,
      )}px; line-height: ${height(8)}px; font-size: ${height(3)}px;" />
        <button id="room-create-btn" style="margin-top: ${height(
          4,
        )}px; width: ${height(15.5)}px; height: ${height(15.5 * 0.6)}px;" />
        <input id="room-number" type="text" placeholder="${
          !roomService.room ? '请黏贴房间号或创建房间' : roomService.room.id
        }" style="margin-top: ${height(5.5)}px; height: ${height(
        6,
      )}px; line-height: ${height(8)}px; font-size: ${height(3)}px;" />
      <button id="room-join-btn" style="margin-top: ${height(
        4,
      )}px; width: ${height(15.5)}px; height: ${height(15.5 * 0.6)}px;" />
      </div>`,
    );

    $('#room-create-btn').on('click', this.onRoomCreate);
    $('#room-join-btn').on('click', this.onJoinRoom);
    $('#start-game-btn').on('click', this.onStartGame);
  }

  private onRoomCreate = (): void => {
    let player = playerService.player;

    if (!player) {
      throw new Error('Player not exists');
    }

    roomService
      .createRoom(player.id)
      .then(() => {
        let textBox = $('#room-number');

        let room = roomService.room;

        if (!room) {
          throw new Error('room not exists');
        }

        textBox.val(room.id);
      })
      .catch(console.error);
  };

  private onJoinRoom = (): void => {
    let player = playerService.player;

    if (!player) {
      throw new Error('Player not exists');
    }

    let roomName = $('#room-number').val() as string;
    console.info(roomName, player.id);
    roomService.joinRoom(roomName, (_room, players) => {
      console.info('Now players:', players.map(player => player.id));

      $('#room-player-list').empty();

      for (let it of players) {
        $('#room-player-list').append(
          `<div class="room-player-in-list" style="margin: ${height(
            0.5,
          )}px 0; height: ${height(4)}px; line-height: ${height(
            4,
          )}px; font-size: ${height(3)}px; padding:10px">
          ${it.id}
          </div>`,
        );
      }
    });

    gameService.onGameStart(() => {
      this.scene.switch('BoardScene');
    });
  };

  private onSceneDestroy = (): void => {
    this.destroyLoginForm();
  };

  private onStartGame = (): void => {
    gameService.startGame();
  };

  private destroyLoginForm(): void {
    $('.room-form-div').remove();
  }
}

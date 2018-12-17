import 'animate.css';

import $ from 'jquery';
import {GameObjects, Scene} from 'phaser';

import {
  gameHeight,
  gameWidth,
  height,
  ratio,
  scaleGameObject,
  width,
} from '../../utils/ratio';

import './style.less';

export interface LandPos {
  x: number;
  y: number;
  type: string;
}

export class BoardScene extends Scene {
  private gameOptions = {
    landCount: 6,
    paddingX: width(10),
    paddingY: height(20),
  };

  // board 位置数组
  private boardPosList: LandPos[] = [];

  private boardData: any;

  private myDice: any | undefined;

  private points = [
    // bottom:
    {
      pos: 'bottom',
      x: gameWidth / 2,
      y: gameHeight - this.gameOptions.paddingY,
      posX: -1,
      posY: -1,
    },
    // left:
    {
      pos: 'left',
      x: this.gameOptions.paddingX,
      y: gameHeight / 2,
      posX: 1,
      posY: -1,
    },
    // top:
    {
      pos: 'top',
      x: gameWidth / 2,
      y: this.gameOptions.paddingY,
      posX: 1,
      posY: 1,
    },
    // right:
    {
      pos: 'right',
      x: gameWidth - this.gameOptions.paddingX,
      y: gameHeight / 2,
      posX: -1,
      posY: 1,
    },
  ];

  private playerOffset = [
    {
      offsetX: 0.02,
      offsetY: -0.05,
    },
    {
      offsetX: 0,
      offsetY: -0.09,
    },
    {
      offsetX: 0,
      offsetY: -0.01,
    },
    {
      offsetX: -0.02,
      offsetY: -0.05,
    },
  ];

  private landGroup!: Phaser.GameObjects.Group;
  private playerGroup!: Phaser.GameObjects.Group;

  constructor() {
    super({key: 'BoardScene'});
  }

  preload(): void {
    this.load.pack('board', 'data/asset-pack.json', null, this);
    // this.load.image('green-block', 'assets/green-block.png');
    this.load.json({
      key: 'board-pos',
      url: 'data/board.json',
    });

    this.load.script('dice-script', '/js/dice.js');
  }

  create(): void {
    this.createScene();
    this.landGroup = this.add.group();
    this.playerGroup = this.add.group();
    // 计算board坐标
    this.analyseBoard();
    this.boardData = this.cache.json.get('board-pos');
    this.drawBoardFromJson();
    this.createDice();
    this.createPlayers(4);

    this.drawHouse(1, 1);
    this.drawHouse(2, 2);
    this.drawHouse(3, 3);
    this.drawHouse(4, 4);
    this.drawHouse(5, 5);
    this.drawHouse(6, 6);
    this.drawHouse(7, 7);

    this.rollDice(6); // for test
  }

  private createScene(): void {}

  private analyseBoard(): void {
    let count = this.gameOptions.landCount - 1;
    let offsetX = (gameWidth / 2 - this.gameOptions.paddingX) / count;
    let offsetY = (gameHeight / 2 - this.gameOptions.paddingY) / count;
    this.points.forEach(element => {
      for (let i = 0; i < count; i++) {
        let landX = element.x + element.posX * offsetX * i;
        let landY = element.y + element.posY * offsetY * i;
        let pos = element.pos + i;
        let posJson = {
          x: landX / gameWidth,
          y: landY / gameHeight,
          type: 'neutral',
        };
        // this.drawLand(landX, landY, 'blue-block');
        this.boardPosList.push(posJson);
      }
    });
    this.boardPosList[0].type = 'start';
    this.boardPosList[count * 2].type = 'jail';
    this.boardPosList[count].type = 'parking';
    this.boardPosList[count * 3].type = 'parking';
    console.log(this.boardPosList);
    // this.load.saveJSON(boardJson, 'file/test.json');
  }

  private drawLand(x: number, y: number, image: string): void {
    let land = this.add.image(x, y, image);
    scaleGameObject(land, 6 / this.gameOptions.landCount);
    this.landGroup.add(land);
  }

  private drawBoardFromJson(): void {
    this.boardPosList.forEach(element => {
      this.drawLand(
        element.x * gameWidth,
        element.y * gameHeight,
        element.type,
      );
    });
  }

  private drawHouse(landNum: number, houseNum: number): void {
    let concatStrNum = (str: string, num: number): string => str + num;
    let houseImage = concatStrNum('building-', houseNum);
    let landPos = this.boardPosList[landNum];
    let house = this.add.image(
      (landPos.x - 0.02) * gameWidth,
      (landPos.y - 0.05) * gameHeight,
      houseImage,
    );
    scaleGameObject(house, 0.4);
    this.landGroup.add(house);
  }

  private createPlayers(playerNum: number): void {
    let concatStrNum = (str: string, num: number): string => str + num;
    let landPos = this.boardPosList[0];

    for (let i = 0; i < playerNum; i++) {
      let playerName = concatStrNum('player', i);
      let x=(landPos.x + this.playerOffset[i].offsetX) * gameWidth;
      let y =(landPos.y + this.playerOffset[i].offsetY) * gameHeight;
      let player = this.add.image(
        (landPos.x + this.playerOffset[i].offsetX) * gameWidth,
        (landPos.y + this.playerOffset[i].offsetY) * gameHeight,
        playerName,
      );
      scaleGameObject(player, 0.7);
      this.playerGroup.add(player);
    }
  }

  private createDice(): void {
    if ($('#area').length) {
      return;
    }

    $('#game-playground').append(
      `<div id="area"
       style=" width: ${width(30)}px;
              height: ${height(28)}px;">
        <div id="dice-area"></div>
        <div id="operation">
        <button id="roll-btn"
        style="margin: ${height(2)}px;
               width: ${height(15.5)}px;
               height: ${height(15.5 * 0.6)}px;"
               >roll</button>
      </div>
    </div>
      `,
    );

    this.myDice = dice(document.getElementById('dice-area'), width(10));

    // $('#stop-btn').on('click', () => {
    //   myDice.stop();
    // });
  }

  private rollDice(faceValue: number): void {
    $('#roll-btn').on('click', () => {
      this.myDice.roll(faceValue);
      console.log(this.playerGroup.getChildren());
    });
  }
}

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

  private paddingX: number = 10;
  private paddingY: number = 10;
  private playerStyle = [
    {
      // top-left
      img: 'player0',
      land: 'yellow-block',
      backgroundLine: 'yellow-bg',
      color: '#fccf39',
      posX: width(this.paddingX),
      posY: height(this.paddingY),
    },
    {
      // bottom-right
      img: 'player1',
      land: 'blue-block',
      backgroundLine: 'blue-bg',
      color: '#355973',
      posX: gameWidth - width(this.paddingX),
      posY: gameHeight - height(this.paddingY),
    },
    {
      // top-right
      img: 'player2',
      land: 'green-block',
      backgroundLine: 'green-bg',
      color: '#65bc16',
      posX: gameWidth - width(this.paddingX),
      posY: height(this.paddingY),
    },
    {
      // bottom-left
      img: 'player3',
      land: 'red-block',
      backgroundLine: 'red-bg',
      color: '#b91124',
      posX: width(this.paddingX),
      posY: gameHeight - height(this.paddingY),
    },
  ];

  private landGroup!: Phaser.GameObjects.Group;
  private playerGroup!: Phaser.GameObjects.Group;
  private playerInfoGroup!: Phaser.GameObjects.Group;

  private bezierGraphics: Phaser.GameObjects.Graphics;
  // private player!:Phaser.GameObjects.Image;
  private bezierCurve!: Phaser.Curves.CubicBezier;

  private i: number = 0;

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
    this.load.script(
      'webfont',
      'https://ajax.googleapis.com/ajax/libs/webfont/1.6.26/webfont.js',
    );
  }

  create(): void {
    this.createScene();
    this.landGroup = this.add.group();
    this.playerGroup = this.add.group();
    this.playerInfoGroup = this.add.group();

    this.bezierGraphics = this.add.graphics();
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

    // this.playerJump(1); // for test

    this.createPlayersInfo(4); // for test
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
      let x = (landPos.x + this.playerOffset[i].offsetX) * gameWidth;
      let y = (landPos.y + this.playerOffset[i].offsetY) * gameHeight;
      let player = this.add.image(x, y, playerName);
      scaleGameObject(player, 0.7);
      player.setDepth(100);
      this.playerGroup.add(player);
    }
  }

  private createPlayersInfo(playerNum: number): void {
    let concatStrNum = (str: string, num: number): string => str + num;

    for (let i = 0; i < playerNum; i++) {
      let playerLine = this.add.image(
        this.playerStyle[i].posX,
        this.playerStyle[i].posY + height(5),
        this.playerStyle[i].backgroundLine,
      );
      scaleGameObject(playerLine, 0.5);

      console.log(this.playerStyle[i].posX);
      let playerInfoText = this.add.text(
        this.playerStyle[i].posX,
        this.playerStyle[i].posY,
        'Player1',
        {
          fontFamily: 'Arial Black',
          fontSize: 74,
          color: this.playerStyle[i].color,
        },
      );
      playerInfoText.setOrigin(0.5, 0.5);
      playerInfoText
        .setStroke(this.playerStyle[i].color, 16)
        .setShadow(2, 2, '#fff', 2, true, true);
      scaleGameObject(playerInfoText);
      this.playerInfoGroup.add(playerInfoText);

      let playerImg = this.add.image(
        this.playerStyle[i].posX,
        this.playerStyle[i].posY,
        this.playerStyle[i].img,
      );
    }
  }

  private createDice = (): void => {
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
  };

  private rollDice = (faceValue: number): void => {
    $('#roll-btn').on('click', () => {
      this.myDice.roll(faceValue);
      this.playerJump(this.i); // for test
      this.i = (this.i + 1) % ((this.gameOptions.landCount - 1) * 4);
      console.log(this.boardPosList[this.i]);
    });
  };

  private playerJump = (pos: number): void => {
    // for (let i = 0; i < (this.gameOptions.landCount - 1) * 4 - 1; i++) {
    console.log(this.boardPosList[pos]);
    console.log(this.boardPosList[pos + 1]);
    let start = {
      x: this.boardPosList[pos].x * gameWidth,
      y: this.boardPosList[pos].y * gameHeight,
    };
    let nextPos = (pos + 1) % ((this.gameOptions.landCount - 1) * 4);
    let end = {
      x: this.boardPosList[nextPos].x * gameWidth,
      y: this.boardPosList[nextPos].y * gameHeight,
    };
    this.movePlayer(start, end);
    // }

    // this.movePlayer({x: 100, y: 100}, {x: 200, y: 200});
  };

  private movePlayer = (start: any, end: any): void => {
    let startPoint = new Phaser.Math.Vector2(start.x, start.y);
    let endPoint = new Phaser.Math.Vector2(end.x, end.y);
    let stepX = end.x - start.x;
    let stepY = end.y - start.y;
    console.log(start.x);
    let marker = this.playerGroup.getChildren()[0] as Phaser.GameObjects.Image;
    let controlPoint1 = new Phaser.Math.Vector2(
      marker.x + (stepX * 2) / 3,
      marker.y + stepY / 2,
    );
    let controlPoint2 = new Phaser.Math.Vector2(
      marker.x + (stepX * 2) / 3,
      marker.y + stepY / 2,
    );
    this.bezierCurve = new Phaser.Curves.CubicBezier(
      startPoint,
      controlPoint1,
      controlPoint2,
      endPoint,
    );
    this.bezierGraphics.y = 0;
    this.bezierGraphics.clear();
    this.bezierGraphics.lineStyle(4, 0xffffff);
    this.bezierCurve.draw(this.bezierGraphics);
    let tweenValue = {
      value: 0,
      previousValue: 0,
    };
    this.tweens.add({
      targets: tweenValue,
      value: 1,
      duration: 500,
      callbackScope: this,
      onComplete: () => {},
      onUpdate: (tween: Phaser.Tweens.TweenManager, target: any) => {
        let position = this.bezierCurve.getPoint(target.value);
        let prevPosition = this.bezierCurve.getPoint(target.previousValue);
        let step = target.value - target.previousValue;
        marker.x += position.x - prevPosition.x;
        marker.y += position.y - prevPosition.y;
        target.previousValue = target.value;
      },
    });
  };
}

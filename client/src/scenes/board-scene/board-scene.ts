import {Scene} from 'phaser';

import {
  gameHeight,
  gameWidth,
  height,
  ratio,
  scaleGameObject,
  width,
} from '../../utils/ratio';

export class BoardScene extends Scene {
  private gameOptions = {
    landCount: 5,
    paddingX: width(10),
    paddingY: height(20),
  };

  private boardData: any;

  private points = [
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
  ];

  private landGroup!: Phaser.GameObjects.Group;

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
  }

  create(): void {
    this.landGroup = this.add.group();
    // 计算board坐标
    // this.analyseBoard();
    this.boardData = this.cache.json.get('board-pos');
    this.drawBoardFromJson();
    this.drawHouse(1, 1);
    this.drawHouse(2, 2);
    this.drawHouse(3, 3);
    this.drawHouse(4, 4);
    this.drawHouse(1, 5);
    this.drawHouse(2, 6);
    this.drawHouse(3, 7);
  }

  analyseBoard(): void {
    let count = this.gameOptions.landCount - 1;
    let offsetX = (gameWidth / 2 - this.gameOptions.paddingX) / count;
    let offsetY = (gameHeight / 2 - this.gameOptions.paddingY) / count;
    // board 位置json
    let boardJson = {};
    this.points.forEach(element => {
      for (let i = 0; i < count; i++) {
        let landX = element.x + element.posX * offsetX * i;
        let landY = element.y + element.posY * offsetY * i;
        let pos = element.pos + i;
        let posJson = {
          x: landX / gameWidth,
          y: landY / gameHeight,
        };
        this.drawLand(landX, landY, 'green-block');
        boardJson[pos] = posJson;
      }
    });
    console.log(boardJson);
    // this.load.saveJSON(boardJson, 'file/test.json');
  }

  drawLand(x: number, y: number, image: string): void {
    let land = this.add.image(x, y, image);
    scaleGameObject(land, 7 / this.gameOptions.landCount);
    this.landGroup.add(land);
  }

  drawBoardFromJson(): void {
    this.boardData.forEach(element => {
      this.drawLand(
        element.x * gameWidth,
        element.y * gameHeight,
        element.type,
      );
    });
  }

  drawHouse(houseNum: number, landNum: number): void {
    let concatStrNum = (str: string, num: number): string => str + num;
    let houseImage = concatStrNum('building-', houseNum);
    let landPos = this.boardData[landNum];
    let house = this.add.image(
      (landPos.x - 0.03) * gameWidth,
      (landPos.y - 0.05) * gameHeight,
      houseImage,
    );
    scaleGameObject(house, 0.4);
    this.landGroup.add(house);
  }
}

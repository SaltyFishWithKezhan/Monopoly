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
    paddingY: height(10),
  };

  private points = [
    // top:
    {
      x: gameWidth / 2,
      y: this.gameOptions.paddingY,
      posX: 1,
      posY: 1,
    },
    // left:
    {
      x: this.gameOptions.paddingX,
      y: gameHeight / 2,
      posX: 1,
      posY: -1,
    },
    // right:
    {
      x: gameWidth - this.gameOptions.paddingX,
      y: gameHeight / 2,
      posX: -1,
      posY: 1,
    },
    // bottom:
    {
      x: gameWidth / 2,
      y: gameHeight - this.gameOptions.paddingY,
      posX: -1,
      posY: -1,
    },
  ];

  private landGroup!: Phaser.GameObjects.Group;

  constructor() {
    super({key: 'BoardScene'});
  }

  preload(): void {
    this.load.image('green-block', 'assets/green-block.png');
    this.load.image('red-block', 'assets/red-block.png');
  }

  create(): void {
    this.landGroup = this.add.group();
    this.addLandX();
  }

  addLandX(): void {
    let count = this.gameOptions.landCount - 1;
    let offsetX = (gameWidth / 2 - this.gameOptions.paddingX) / count;
    let offsetY = (gameHeight / 2 - this.gameOptions.paddingY) / count;

    this.points.forEach(element => {
      for (let i = 0; i < count; i++) {
        let landX = element.x + element.posX * offsetX * i;
        let landY = element.y + element.posY * offsetY * i;
        let land = this.add.image(landX, landY, 'green-block');
        console.log(landX / gameWidth, landY / gameHeight);
        scaleGameObject(land);
        this.landGroup.add(land);
      }
    });
  }
}

import {Game, Scene} from 'phaser';

import {gameHeight, gameWidth, ratio} from '../utils/ratio';

export class BoardScene extends Scene {
  private gameOptions = {
    landWidth: 183 * ratio,
    landHeight: 109 * ratio,
    landCount: 5,
    padding: 120 * ratio,
    landScale: 0.6,
  };

  private land!: Phaser.GameObjects.Image;
  private landGroup!: Phaser.GameObjects.Group;

  constructor() {
    super({key: 'BoardScene'});
  }

  preload(): void {
    this.load.image('green-block', 'assets/green-block.png');
  }

  create(): void {
    this.landGroup = this.add.group();
    // this.land = this.add.image(800, 600, 'green-block');
    // this.land.setScale(0.5);
    this.addLandX();
  }

  addLandX(): void {
    let offset = {x: 0, y: 0};
    offset.x = gameWidth / 2;
    offset.y = gameHeight - this.gameOptions.padding;
    console.log(offset.y);

    for (let j = 0; j < this.gameOptions.landCount; j++) {
      let landX = this.gameOptions.landWidth * j + offset.x;
      let landY = offset.y - ((this.gameOptions.landHeight * j) / 4) * 3;
      let land = this.add.sprite(landX, landY, 'green-block');
      land.setScale(this.gameOptions.landScale);
      console.log(landX, landY);
      land.setOrigin(0, 0);
      this.landGroup.add(land);
    }
  }
}

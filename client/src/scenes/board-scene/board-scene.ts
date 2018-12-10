import {Scene} from 'phaser';

import {gameHeight, gameWidth, ratio} from '../../utils/ratio';

export class BoardScene extends Scene {
  private gameOptions = {
    landWidth: 183 * ratio,
    landHeight: 109 * ratio,
    landCount: 5,
    padding: 120 * ratio,
  };

  private landGroup!: Phaser.GameObjects.Group;

  constructor() {
    super({key: 'BoardScene'});
  }

  preload(): void {
    // this.load.setBaseURL('http://labs.phaser.io');
    this.load.image('green-block', 'assets/green-block.png');
  }

  create(): void {
    this.landGroup = this.add.group();
    this.add.image(800, 600, 'green-block');
  }

  addLandX(): void {
    let offset = {x: 0, y: 0};
    offset.x = gameWidth / 2;
    offset.y = gameHeight - this.gameOptions.padding;

    for (let j = 0; j < this.gameOptions.landCount; j++) {
      let landX = this.gameOptions.landWidth * j + offset.x;
      let landY = offset.y - ((this.gameOptions.landHeight * j) / 4) * 3;
      let land = this.add.sprite(landX, landY, 'green-block');
      land.setOrigin(0, 0);
      this.landGroup.add(land);
    }
  }
}

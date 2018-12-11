import {GameObjects, Scene} from 'phaser';

import {
  gameHeight,
  gameWidth,
  height,
  scale,
  scaleGameObject,
  width,
} from '../../utils/ratio';

export class EnterLoadingScene extends Scene {
  loadingText!: GameObjects.Text;

  constructor() {
    super({key: 'EnterLoadingScene'});
  }

  preload(): void {
    this.load.animation(
      'barsData',
      '/assets/loading-bar/loading-animation.json',
    );
    this.load.atlas(
      'bars',
      '/assets/loading-bar/loading-bar-1.png',
      '/assets/loading-bar/loading-bars.json',
    );
  }

  create(): void {
    let loadingBar = this.add.sprite(
      gameWidth / 2,
      gameHeight / 2 - height(5),
      'bars',
    );

    let loadingText = this.add.text(
      gameWidth / 2 - width(5),
      gameHeight / 2 + height(2),
      'Loading...',
    );

    loadingText.setAlign('center');

    loadingText.setFontSize(scale(35));

    this.loadingText = loadingText;

    loadingBar.play('loading-bar', true, 1);

    scaleGameObject(loadingBar, 1.5);

    setTimeout(() => {
      this.scene.switch('LoginScene');
    }, 4000);
  }

  update(time: number, _delta: number): void {
    let backNum = Math.floor(time / 150) % 4;

    this.loadingText.setText(`Loading${'.'.repeat(backNum)}`);
  }
}

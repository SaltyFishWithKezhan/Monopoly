import ImagePreloader from 'image-preloader';
import {GameObjects, Scene} from 'phaser';

import {servicesReady} from '../../service-entrances';
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

    let imagePreloader = new ImagePreloader();

    let preloadList: string[] = [
      '/assets/logo.png',
      '/assets/all_resourses.png',
      '/assets/ui.png',
      '/assets/lg-btn-join.png',
      '/assets/lg-btn-join-hover.png',
      '/assets/lg-btn-join-active.png',
      '/assets/lg-text-player.png',
      '/assets/lg-bg.jpg',
    ];

    imagePreloader
      .preload(...preloadList)
      .then(() => {
        return servicesReady;
      })
      .then(() => {
        this.scene.switch('LoginScene');
      })
      .catch(console.error);
  }

  update(time: number, _delta: number): void {
    let backNum = Math.floor(time / 150) % 4;

    this.loadingText.setText(`Loading${'.'.repeat(backNum)}`);
  }
}

import {Scene} from 'phaser';

export class LoginScene extends Scene {
  constructor() {
    super({key: 'LoginScene'});
  }

  preload(): void {
    this.load.setBaseURL('http://labs.phaser.io');
    this.load.image('sky', 'assets/skies/space3.png');
    this.load.image('logo', 'assets/sprites/phaser3-logo.png');
    this.load.image('red', 'assets/particles/red.png');
  }

  create(): void {
    this.add.image(800, 600, 'sky');
    let particles = this.add.particles('red');
    let emitter = particles.createEmitter({
      speed: 100,
      scale: {start: 1, end: 0},
      blendMode: 1,
    });
    let logo = this.physics.add.image(400, 100, 'logo');
    logo.setVelocity(100, 200);
    logo.setFriction(50, 100);
    logo.setBounce(1, 1);
    logo.setCollideWorldBounds(true);
    emitter.startFollow(logo);
  }
}

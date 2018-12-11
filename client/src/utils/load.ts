import {Scene} from 'phaser';

export function prefixInteger(num: number, length: number): string {
  return (Array(length).join('0') + num).slice(-length);
}

export function loadImageSeq(
  this: Scene,
  path: string,
  imageName: (seq: string) => string,
  sequenceCount: number,
  seqLength: number = 4,
): void {
  for (let i = 1; i <= sequenceCount; i++) {
    let baseName = imageName(prefixInteger(i, seqLength));

    let filePath = `${path}${baseName}.png`;

    this.load.image(baseName, filePath);
  }
}

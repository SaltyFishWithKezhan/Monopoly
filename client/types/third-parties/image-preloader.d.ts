declare interface LoadingInfo {
  status: boolean;
  value: HTMLImageElement;
}

type Image = string | HTMLImageElement;
type OnProgressCallback = (info: LoadingInfo) => void;

declare class ImagePreloader {
  fallbackImage?: Image;
  onProgress?: OnProgressCallback;

  constructor(fallbackImage?: Image, onProgress?: OnProgressCallback);

  preload(images: Image[]): Promise<LoadingInfo[]>;
  preload(...images: Image[]): Promise<LoadingInfo[]>;
  preload(...images: any): Promise<LoadingInfo[]>;
}

declare namespace ImagePreloader {
  export function simplePreload(imageSource: Image): Promise<HTMLImageElement>;
}

declare module 'image-preloader' {
  export = ImagePreloader;
}

import {httpService, listen, servicesReady} from '../bld/service-entrances';

export async function runServer(): Promise<void> {
  return new Promise<void>((resolve, reject) => {
    servicesReady
      .then(() => {
        listen();
        resolve();
      })
      .catch(error => reject(error));
  });
}

export function stopServer(): void {
  httpService.stop();
}

import {listen, servicesReady} from './service-entrances';

servicesReady
  .then(() => {
    listen();
  })
  .catch(error => {
    console.error(error);
    process.exit(1);
  });

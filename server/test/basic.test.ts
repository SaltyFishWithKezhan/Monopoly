// tslint:disable

import SocketIO from 'socket.io-client';
import {runServer, stopServer} from './utils';

jest.setTimeout(999999);

let io = SocketIO('http://localhost:8090');

beforeAll(done => {
  runServer().then(() => done());
});

afterAll(() => {
  stopServer();
});

test('player:login', () => {
  let promise = new Promise<any>(resolve => {
    io.on('player:success', (action: string, playerTransfer: object) => {
      resolve({action, playerTransfer});
    });

    io.on('player:fail', (action: string, playerTransfer: object) => {
      resolve({action, playerTransfer});
    });

    io.emit('player:login', 'Dizy');
  });

  return promise.then(({action, playerTransfer}) => {
    expect(action).toBe('player:login');
    expect(playerTransfer).toHaveProperty('id', 'Dizy');
  });
});

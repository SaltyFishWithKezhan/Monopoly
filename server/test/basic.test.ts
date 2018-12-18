// tslint:disable

import SocketIO from 'socket.io-client';
import {runServer, stopServer} from './utils';

const PLAYER_NAME = 'Dizy';

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

    io.on('player:fail', (action: string, code: number) => {
      resolve({action, code});
    });

    io.emit('player:login', PLAYER_NAME);
  });

  return promise.then(({action, playerTransfer}) => {
    expect(action).toBe('player:login');
    expect(playerTransfer).toHaveProperty('id', PLAYER_NAME);
  });
});

let roomId: string = '';

test('create room', () => {
  let promise = new Promise<any>(resolve => {
    io.on('room:success', (action: string, roomTransfer: object) => {
      resolve({action, roomTransfer});
    });

    io.on('room:fail', (action: string, code: number) => {
      resolve({action, code});
    });

    io.emit('room:create');
  });

  return promise.then(({action, roomTransfer}) => {
    expect(action).toBe('room:create');
    expect(roomTransfer).toHaveProperty('id');

    if ('id' in roomTransfer) {
      roomId = roomTransfer['id'];
    }
  });
});

test('join room', () => {
  let promise = new Promise<any>(resolve => {
    io.on('room:success', (action: string, roomTransfer: object) => {
      resolve({action, roomTransfer});
    });

    io.on('room:fail', (action: string, code: number) => {
      resolve({action, code});
    });

    io.emit('room:join', roomId);
  });

  return promise.then(({action, roomTransfer}) => {
    expect(action).toBe('room:join');
    expect(roomTransfer).toHaveProperty('id', roomId);
    expect(roomTransfer['data']['players']).toContain(PLAYER_NAME);
  });
});

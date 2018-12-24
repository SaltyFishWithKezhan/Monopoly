// tslint:disable

import SocketIO from 'socket.io-client';
import {runServer, stopServer} from './utils';

const PLAYER_NAME = 'Dizy';

jest.setTimeout(5000);

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
    io.on(
      'room:player-join',
      (roomTransfer: string, playerTransfers: object[]) => {
        resolve({roomTransfer, playerTransfers});
      },
    );

    io.on('room:fail', (action: string, code: number) => {
      resolve({action, code});
    });

    io.emit('room:join', roomId);

    console.log('roomId', roomId);
  });

  return promise.then(({roomTransfer, playerTransfers}) => {
    expect(roomTransfer).toHaveProperty('id', roomId);
    expect(Array.isArray(playerTransfers)).toBeTruthy();
  });
});

test('start game', () => {
  let promise = new Promise<any>(resolve => {
    io.on(
      'game:game-start',
      (
        d1: object,
        d2: object[],
        d3: object,
        d4: object,
        d5: object[],
        d6: object[],
        d7: object[],
        d8: object[],
      ) => {
        let data = [d1, d2, d3, d4, d5, d6, d7, d8];
        resolve(data);
      },
    );

    io.on('game:fail', (action: string, code: number) => {
      resolve({action, code});
    });

    io.emit('game:start');
  });

  return promise.then(data => {
    expect(typeof data).toBe('object');
    console.log(data);
  });
});

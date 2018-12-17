import SocketIO from 'socket.io-client';

let io = SocketIO();

test('player:login', () => {
  io.emit('player:login');
  expect(1 + 1).toBe(2);
});

import SocketIO from 'socket.io-client';

export class SocketService {
  io = SocketIO();

  constructor() {
    this.initialize();
  }

  private initialize(): void {
    this.io.on('connect', () => {});
  }
}

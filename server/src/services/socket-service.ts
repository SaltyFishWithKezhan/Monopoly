import SocketIO from 'socket.io';

export class SocketService {
  constructor(public io: SocketIO.Server) {
    this.initialize();
  }

  private initialize(): void {
    this.io.in('lobby');

    this.io.on('connect', socket => {
      this.initializeSocket(socket);
    });
  }

  private initializeSocket(_socket: SocketIO.Socket): void {}
}

export class SocketService {
  constructor(public io: SocketIO.Server) {
    this.initialize();
  }

  private initialize(): void {
    this.io.in('lobby');

    this.io.on('connection', () => {});
  }
}

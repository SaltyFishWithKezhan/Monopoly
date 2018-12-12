import SocketIO from 'socket.io-client';

import {UIService} from './ui-service';

export class SocketService {
  io = SocketIO();

  constructor(private uiService: UIService) {
    this.initialize();
  }

  private initialize(): void {
    this.io.on('connect', () => {});

    this.io.on('placeholder', () => {
      this.uiService.showMask();
    });
  }
}

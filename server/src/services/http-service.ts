import {Server} from 'http';

import express from 'express';

import {CLIENT_BUILD_DIR} from '../paths';

export class HTTPService {
  constructor(private app: express.Express, private httpServer: Server) {
    this.initialize();
  }

  listen(port: number = 8090): void {
    this.httpServer.listen(port);
  }

  private initialize(): void {
    this.app.use(express.static(CLIENT_BUILD_DIR));
  }
}

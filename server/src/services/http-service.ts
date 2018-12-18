import {Server} from 'http';

import express from 'express';

import {CLIENT_BUILD_DIR, CLIENT_PUBLIC_DIR} from '../paths';

export class HTTPService {
  constructor(private app: express.Express, private httpServer: Server) {
    this.initialize();
  }

  listen(port: number = 8090): void {
    this.httpServer.listen(port);
  }

  stop(): void {
    this.httpServer.close();
  }

  private initialize(): void {
    this.app.use(express.static(CLIENT_BUILD_DIR));
    this.app.use(express.static(CLIENT_PUBLIC_DIR));
  }
}

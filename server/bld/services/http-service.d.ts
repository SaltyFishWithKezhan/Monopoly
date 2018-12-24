/// <reference types="node" />
import { Server } from 'http';
import express from 'express';
export declare class HTTPService {
    private app;
    private httpServer;
    constructor(app: express.Express, httpServer: Server);
    listen(port?: number): void;
    stop(): void;
    private initialize;
}

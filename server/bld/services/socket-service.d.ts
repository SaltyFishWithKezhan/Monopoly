import SocketIO from 'socket.io';
export declare class SocketService {
    io: SocketIO.Server;
    constructor(io: SocketIO.Server);
    private initialize;
    private initializeSocket;
}

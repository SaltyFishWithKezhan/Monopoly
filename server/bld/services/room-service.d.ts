import * as Shared from 'shared';
import { SocketService } from './socket-service';
declare global {
    namespace SocketIO {
        interface Socket {
            room: Shared.Room | undefined;
        }
    }
}
export declare class RoomService {
    private socketService;
    private modelService;
    private io;
    constructor(socketService: SocketService, modelService: Shared.ModelService);
    private initialize;
    private initializeSocket;
}

import { ModelService, Player } from 'shared';
import { SocketService } from './socket-service';
declare global {
    namespace SocketIO {
        interface Socket {
            player: Player | undefined;
        }
    }
}
export declare class PlayerService {
    private socketService;
    private modelService;
    constructor(socketService: SocketService, modelService: ModelService);
    private initialize;
    private initializeSocket;
    private cleanUpRoom;
}

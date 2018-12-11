import { ModelService } from 'shared';
import { SocketService } from './socket-service';
export declare class PlayerService {
    private socketService;
    private modelService;
    constructor(socketService: SocketService, modelService: ModelService);
    private initialize;
    private initializeSocket;
}

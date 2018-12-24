import { ModelService } from 'shared';
import { SocketService } from './socket-service';
export declare class GameService {
    private socketService;
    private modelService;
    private io;
    constructor(socketService: SocketService, modelService: ModelService);
    private initialize;
    private initializeSocket;
    private playerMoveOnGoLand;
    private playerMoveOnConstructionLand;
    private playerMoveOnJailLand;
    private moveOnToNextPlayer;
}

import { ModelService } from 'shared';
import { HTTPService, PlayerService, SocketService } from './services';
export declare const httpService: HTTPService;
export declare const socketService: SocketService;
export declare const modelService: ModelService;
export declare const playerService: PlayerService;
export declare const servicesReady: Promise<never[]>;
export declare function listen(): void;

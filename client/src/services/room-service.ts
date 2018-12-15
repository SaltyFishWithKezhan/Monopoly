import {Room} from 'shared';

import {PromisePool} from '../utils/promise-pool';

export class RoomService extends PromisePool {
  room: Room | undefined;
}

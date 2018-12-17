import {Model} from '../core';

enum MoveResultType {
  BUY_LAND_OPTION = 0,
  PAYMENT = 1,
  REWARD = 2,
  STOP_ROUND = 3,
  CONSTRUCTION_OPTION = 4,
  NOTHING = 5,
}

export interface MoveResultData {
  move_result_type: MoveResultType;
  value: number;
  msg: string;
}

export class MoveResult extends Model {}

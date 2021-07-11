import { Expose, Type } from 'class-transformer';

import { TurnEnded } from '../../../domain/interfaces/GameEvents';
import { TurnDto } from '../entities/TurnDto';

export class TurnEndedDto {
  @Expose()
  type: string;

  @Expose()
  @Type(() => TurnDto)
  turn: TurnDto;

  constructor(event: TurnEnded) {
    this.type = event.type;
    this.turn = new TurnDto(event.turn);
  }
}

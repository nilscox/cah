import { Expose } from 'class-transformer';

import { GameFinished } from '../../../domain/interfaces/GameEvents';

export class GameFinishedDto {
  @Expose()
  type: string;

  constructor(event: GameFinished) {
    this.type = event.type;
  }
}

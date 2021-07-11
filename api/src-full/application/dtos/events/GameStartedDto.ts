import { Expose } from 'class-transformer';

import { GameStarted } from '../../../domain/interfaces/GameEvents';

export class GameStartedDto {
  @Expose()
  type: string;

  constructor(event: GameStarted) {
    this.type = event.type;
  }
}

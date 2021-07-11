import { Expose } from 'class-transformer';

import { PlayerAnswered } from '../../../domain/interfaces/GameEvents';

export class PlayerAnsweredDto {
  @Expose()
  type: string;

  @Expose()
  player: string;

  constructor(event: PlayerAnswered) {
    this.type = event.type;
    this.player = event.player.nick;
  }
}

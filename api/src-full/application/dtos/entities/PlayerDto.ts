import { Expose } from 'class-transformer';

import { Player } from '../../../domain/entities/Player';

export class PlayerDto {
  @Expose()
  nick: string;

  constructor(player: Player) {
    this.nick = player.nick;
  }
}

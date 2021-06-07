import { Expose, Type } from 'class-transformer';

import { PlayerJoined } from '../../../domain/interfaces/GameEvents';
import { PlayerDto } from '../entities/PlayerDto';

export class PlayerJoinedDto {
  @Expose()
  type: string;

  @Expose()
  @Type(() => PlayerDto)
  player: PlayerDto;

  constructor(event: PlayerJoined) {
    this.type = event.type;
    this.player = new PlayerDto(event.player);
  }
}

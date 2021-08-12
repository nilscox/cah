import { IsNotEmpty, IsString } from 'class-validator';

import { CommandHandler } from '../../../ddd/CommandHandler';
import { Player } from '../../../domain/models/Player';
import { FullPlayerDto } from '../../../shared/dtos';
import { PlayerRepository } from '../../interfaces/PlayerRepository';
import { SessionStore } from '../../interfaces/SessionStore';
import { DtoMapperService } from '../../services/DtoMapperService';

export class LoginCommand {
  @IsString()
  @IsNotEmpty()
  nick: string;

  constructor(nick: string) {
    this.nick = nick;
  }
}

export class LoginHandler implements CommandHandler<LoginCommand, FullPlayerDto, SessionStore> {
  constructor(private readonly playerRepository: PlayerRepository, private readonly mapper: DtoMapperService) {}

  async execute({ nick }: LoginCommand, session: SessionStore) {
    let player = await this.playerRepository.findPlayerByNick(nick);

    if (!player) {
      player = new Player(nick);
      await this.playerRepository.save(player);
    }

    session.player = player;

    return this.mapper.toFullPlayerDto(player);
  }
}

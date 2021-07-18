import { IsNotEmpty, IsString } from 'class-validator';

import { CommandHandler } from '../../ddd/CommandHandler';
import { PlayerRepository } from '../../domain/interfaces/PlayerRepository';
import { Player } from '../../domain/models/Player';
import { SessionStore } from '../interfaces/SessionStore';

export class LoginCommand {
  @IsString()
  @IsNotEmpty()
  nick: string;

  constructor(nick: string) {
    this.nick = nick;
  }
}

export class LoginHandler implements CommandHandler<LoginCommand, Player, SessionStore> {
  constructor(private readonly playerRepository: PlayerRepository) {}

  async execute({ nick }: LoginCommand, session: SessionStore) {
    const player = new Player(nick);

    await this.playerRepository.save(player);

    session.player = player;

    return player;
  }
}

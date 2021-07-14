import { IsNotEmpty, IsString } from 'class-validator';

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

export class LoginHandler {
  constructor(private readonly playerRepository: PlayerRepository) {}

  async execute({ nick }: LoginCommand, session: SessionStore) {
    const player = new Player(nick);

    await this.playerRepository.save(player);

    session.player = player;
  }
}

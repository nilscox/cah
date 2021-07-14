import { PlayerRepository } from '../../domain/interfaces/PlayerRepository';
import { SessionStore } from '../interfaces/SessionStore';

export class GetPlayerQuery {
  constructor(public readonly playerId: string) {}
}

export class GetPlayerHandler {
  constructor(private readonly playerRepository: PlayerRepository) {}

  async execute({ playerId }: GetPlayerQuery, session: SessionStore) {
    const player = await this.playerRepository.findPlayerById(playerId);

    if (!player) {
      return;
    }

    if (!session.player?.equals(player)) {
      return { nick: player.nick };
    }

    return { nick: player.nick, cards: player.getCards() };
  }
}

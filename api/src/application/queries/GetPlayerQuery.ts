import { GameRepository } from '../../domain/interfaces/GameRepository';
import { PlayerRepository } from '../../domain/interfaces/PlayerRepository';
import { SessionStore } from '../interfaces/SessionStore';

export class GetPlayerQuery {
  constructor(public readonly playerId: string) {}
}

export class GetPlayerHandler {
  constructor(private readonly playerRepository: PlayerRepository, private readonly gameRepository: GameRepository) {}

  async execute({ playerId }: GetPlayerQuery, session: SessionStore) {
    const player = await this.playerRepository.findPlayerById(playerId);
    const game = await this.gameRepository.findGameForPlayer(playerId);

    if (!player) {
      return;
    }

    if (!session.player?.equals(player)) {
      return { nick: player.nick };
    }

    return { nick: player.nick, gameId: game?.id, cards: player.getCards() };
  }
}

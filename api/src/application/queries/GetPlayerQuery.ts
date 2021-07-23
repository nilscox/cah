import { QueryHandler } from '../../ddd/QueryHandler';
import { PlayerNotFoundError } from '../../domain/errors/PlayerNotFoundError';
import { GameRepository } from '../../domain/interfaces/GameRepository';
import { PlayerRepository } from '../../domain/interfaces/PlayerRepository';
import { SessionStore } from '../interfaces/SessionStore';

export class GetPlayerQuery {
  constructor(public readonly playerId: string) {}
}

export type GetPlayerResult = {
  id: string;
  nick: string;
  gameId?: string;
  cards?: Array<{
    id: string;
    text: string;
  }>;
};

export class GetPlayerHandler implements QueryHandler<GetPlayerQuery, GetPlayerResult, SessionStore> {
  constructor(private readonly playerRepository: PlayerRepository, private readonly gameRepository: GameRepository) {}

  async execute({ playerId }: GetPlayerQuery, session: SessionStore) {
    const player = await this.playerRepository.findPlayerById(playerId);
    const game = await this.gameRepository.findGameForPlayer(playerId);

    if (!player) {
      throw new PlayerNotFoundError();
    }

    if (!session.player?.equals(player)) {
      return {
        id: player.id,
        nick: player.nick,
      };
    }

    return {
      id: player.id,
      nick: player.nick,
      gameId: game?.id,
      cards: player.getCards(),
    };
  }
}

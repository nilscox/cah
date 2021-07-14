import { GameNotFoundError } from '../../domain/errors/GameNotFoundError';
import { PlayerNotFoundError } from '../../domain/errors/PlayerNotFoundError';
import { GameRepository } from '../../domain/interfaces/GameRepository';
import { PlayerRepository } from '../../domain/interfaces/PlayerRepository';

export class GameService {
  constructor(private readonly playerRepository: PlayerRepository, private readonly gameRepository: GameRepository) {}

  async getPlayer(playerId: string) {
    const player = await this.playerRepository.findPlayerById(playerId);

    if (!player) {
      throw new PlayerNotFoundError();
    }

    return player;
  }

  async getGame(gameId: string) {
    const game = await this.gameRepository.findGameById(gameId);

    if (!game) {
      throw new GameNotFoundError();
    }

    return game;
  }

  async getGameForPlayer(playerId: string) {
    const game = await this.gameRepository.findGameForPlayer(playerId);

    if (!game) {
      throw new GameNotFoundError();
    }

    return game;
  }
}

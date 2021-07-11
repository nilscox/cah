import { GameNotFoundError, PlayerNotFoundError } from '../../domain/errors';
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

  async getGameForPlayer(playerId: string) {
    const game = await this.gameRepository.findGameForPlayer(playerId);

    if (!game) {
      throw new GameNotFoundError();
    }

    return game;
  }
}

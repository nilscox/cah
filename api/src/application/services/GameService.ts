import { EventPublisher } from '../../ddd/EventPublisher';
import { GameNotFoundError } from '../../domain/errors/GameNotFoundError';
import { PlayerNotFoundError } from '../../domain/errors/PlayerNotFoundError';
import { DomainEvent } from '../../domain/events';
import { GameRepository } from '../../domain/interfaces/GameRepository';
import { PlayerRepository } from '../../domain/interfaces/PlayerRepository';
import { Game } from '../../domain/models/Game';
import { Player } from '../../domain/models/Player';

export class GameService {
  constructor(
    private readonly playerRepository: PlayerRepository,
    private readonly gameRepository: GameRepository,
    private readonly publisher: EventPublisher<DomainEvent>,
  ) {}

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

  async saveAndPublish(game: Game, player?: Player) {
    await this.gameRepository.save(game);
    await this.playerRepository.save(game.players);

    if (player) {
      this.playerRepository.save(player);
    }

    game.publishEvents(this.publisher);

    for (const player of game.players) {
      player.publishEvents(this.publisher);
    }
  }
}

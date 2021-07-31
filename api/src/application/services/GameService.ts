import { EventPublisher } from '../../ddd/EventPublisher';
import { GameNotFoundError } from '../../domain/errors/GameNotFoundError';
import { PlayerNotFoundError } from '../../domain/errors/PlayerNotFoundError';
import { DomainEvent } from '../../domain/events';
import { Game } from '../../domain/models/Game';
import { Player } from '../../domain/models/Player';
import { GameRepository } from '../interfaces/GameRepository';
import { PlayerRepository } from '../interfaces/PlayerRepository';

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

  async dealCards(game: Game) {
    const availableChoices = await this.gameRepository.findAvailableChoices(game.id);

    game.dealCards(availableChoices.slice());

    const unavailableChoices = availableChoices.filter((choice) => !choice.available);

    await this.gameRepository.markChoicesUnavailable(unavailableChoices.map((choice) => choice.id));
  }

  async saveAndPublish(game: Game, player?: Player) {
    await this.gameRepository.save(game);
    await this.playerRepository.save(game.players);

    if (player) {
      await this.playerRepository.save(player);
    }

    game.publishEvents(this.publisher);

    for (const player of game.players) {
      player.publishEvents(this.publisher);
    }
  }
}

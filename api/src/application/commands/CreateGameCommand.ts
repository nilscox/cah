import { EventPublisher } from '../../ddd/EventPublisher';
import { PlayerIsAlreadyInGameError } from '../../domain/errors/PlayerIsAlreadyInGameError';
import { DomainEvent } from '../../domain/events';
import { GameRepository } from '../../domain/interfaces/GameRepository';
import { Game } from '../../domain/models/Game';
import { RTCManager } from '../interfaces/RTCManager';
import { SessionStore } from '../interfaces/SessionStore';

export class CreateGameCommand {}

export class CreateGameHandler {
  constructor(
    private readonly gameRepository: GameRepository,
    private readonly publisher: EventPublisher<DomainEvent>,
    private readonly rtcManager: RTCManager,
  ) {}

  async execute(_: unknown, session: SessionStore) {
    const player = session.player!;

    if (await this.gameRepository.findGameForPlayer(player.id)) {
      throw new PlayerIsAlreadyInGameError(player);
    }

    const game = new Game();

    game.addPlayer(player);
    this.rtcManager.join(game, player);

    await this.gameRepository.save(game);

    game.publishEvents(this.publisher);

    return { id: game.id };
  }
}

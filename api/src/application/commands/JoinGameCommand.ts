import { EventPublisher } from '../../ddd/EventPublisher';
import { PlayerIsAlreadyInGameError } from '../../domain/errors/PlayerIsAlreadyInGameError';
import { DomainEvent } from '../../domain/events';
import { GameRepository } from '../../domain/interfaces/GameRepository';
import { RTCManager } from '../interfaces/RTCManager';
import { SessionStore } from '../interfaces/SessionStore';
import { GameService } from '../services/GameService';

export class JoinGameCommand {
  constructor(public readonly gameId: string) {}
}

export class JoinGameHandler {
  constructor(
    private readonly gameService: GameService,
    private readonly gameRepository: GameRepository,
    private readonly publisher: EventPublisher<DomainEvent>,
    private readonly rtcManager: RTCManager,
  ) {}

  async execute({ gameId }: JoinGameCommand, session: SessionStore) {
    const player = session.player!;

    if (await this.gameRepository.findGameForPlayer(player.id)) {
      throw new PlayerIsAlreadyInGameError(player);
    }

    const game = await this.gameService.getGame(gameId);

    game.addPlayer(player);
    this.rtcManager.join(game, player);

    await this.gameRepository.save(game);

    game.publishEvents(this.publisher);
  }
}

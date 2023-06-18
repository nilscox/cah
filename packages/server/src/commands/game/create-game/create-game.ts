import { Game, GameState } from '@cah/shared';

import { EventPublisherPort } from '../../../event-publisher/event-publisher.port';
import { GeneratorPort } from '../../../generator/generator.port';
import { CommandHandler } from '../../../interfaces/command-handler';
import { DomainEvent } from '../../../interfaces/domain-event';
import { GameRepository } from '../../../persistence/repositories/game/game.repository';

export class GameCreatedEvent extends DomainEvent {
  constructor(gameId: string, public readonly creatorId: string) {
    super('game', gameId);
  }
}

type CreateGameCommand = {
  creatorId: string;
  code?: string;
};

export class CreateGameHandler implements CommandHandler<CreateGameCommand> {
  constructor(
    private generator: GeneratorPort,
    private publisher: EventPublisherPort,
    private gameRepository: GameRepository
  ) {}

  async execute(command: CreateGameCommand): Promise<void> {
    const game: Game = {
      id: this.generator.generateId(),
      code: command.code ?? this.generator.generateGameCode(),
      state: GameState.idle,
    };

    await this.gameRepository.save(game);

    this.publisher.publish<GameCreatedEvent>({
      entity: 'game',
      entityId: game.id,
      creatorId: command.creatorId,
    });
  }
}

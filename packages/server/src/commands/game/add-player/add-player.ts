import { GameState } from '@cah/shared';

import { EventPublisherPort } from 'src/adapters';
import { CommandHandler, DomainEvent } from 'src/interfaces';
import { GameRepository, PlayerRepository } from 'src/persistence';

export class PlayerAddedEvent extends DomainEvent {
  constructor(gameId: string, public readonly playerId: string) {
    super('game', gameId);
  }
}

type AddPlayerCommand = {
  gameId: string;
  playerId: string;
};

export class AddPlayerHandler implements CommandHandler<AddPlayerCommand> {
  constructor(
    private publisher: EventPublisherPort,
    private gameRepository: GameRepository,
    private playerRepository: PlayerRepository
  ) {}

  async execute(command: AddPlayerCommand): Promise<void> {
    const game = await this.gameRepository.findByIdOrFail(command.gameId);
    const player = await this.playerRepository.findByIdOrFail(command.playerId);

    if (player.gameId !== undefined) {
      throw new Error('player is already in a game');
    }

    if (game.state !== GameState.idle) {
      throw new Error('game is not idle');
    }

    player.gameId = game.id;

    await this.playerRepository.save(game);

    this.publisher.publish<PlayerAddedEvent>({
      entity: 'game',
      entityId: game.id,
      playerId: player.id,
    });
  }
}

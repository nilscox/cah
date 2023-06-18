import { GameState } from '@cah/shared';

import { EventPublisherPort } from '../../../event-publisher/event-publisher.port';
import { CommandHandler } from '../../../interfaces/command-handler';
import { DomainEvent } from '../../../interfaces/domain-event';
import { GameRepository } from '../../../persistence/repositories/game/game.repository';
import { PlayerRepository } from '../../../persistence/repositories/player/player.repository';

export type PlayerAddedEvent = DomainEvent<'game', 'player-added', { playerId: string }>;

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
      type: 'player-added',
      payload: {
        playerId: player.id,
      },
    });
  }
}

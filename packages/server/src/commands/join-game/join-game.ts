import { GameState } from '@cah/shared';

import { EventPublisherPort } from 'src/adapters';
import { CommandHandler, DomainEvent } from 'src/interfaces';
import { GameRepository, PlayerRepository } from 'src/persistence';

export class PlayerJoinedEvent extends DomainEvent {
  constructor(gameId: string, public readonly playerId: string) {
    super('game', gameId);
  }
}

type JoinGameCommand = {
  playerId: string;
  code: string;
};

export class JoinGameHandler implements CommandHandler<JoinGameCommand> {
  constructor(
    private publisher: EventPublisherPort,
    private gameRepository: GameRepository,
    private playerRepository: PlayerRepository
  ) {}

  async execute(command: JoinGameCommand): Promise<void> {
    const player = await this.playerRepository.findByIdOrFail(command.playerId);
    const game = await this.gameRepository.findByCode(command.code);

    if (player.gameId !== undefined) {
      throw new Error('player is already in a game');
    }

    if (game.state !== GameState.idle) {
      throw new Error('game is not idle');
    }

    player.gameId = game.id;

    await this.playerRepository.save(player);

    this.publisher.publish(new PlayerJoinedEvent(game.id, player.id));
  }
}

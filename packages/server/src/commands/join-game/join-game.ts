import { injectableClass } from 'ditox';

import { EventPublisherPort } from 'src/adapters';
import { GameState } from 'src/entities';
import { CommandHandler, DomainEvent } from 'src/interfaces';
import { GameRepository, PlayerRepository } from 'src/persistence';
import { TOKENS } from 'src/tokens';

export class PlayerJoinedEvent extends DomainEvent {
  constructor(
    gameId: string,
    public readonly playerId: string,
  ) {
    super('game', gameId);
  }
}

type JoinGameCommand = {
  playerId: string;
  code: string;
};

export class JoinGameHandler implements CommandHandler<JoinGameCommand> {
  static inject = injectableClass(
    this,
    TOKENS.publisher,
    TOKENS.repositories.game,
    TOKENS.repositories.player,
  );

  constructor(
    private publisher: EventPublisherPort,
    private gameRepository: GameRepository,
    private playerRepository: PlayerRepository,
  ) {}

  async execute(command: JoinGameCommand): Promise<void> {
    const player = await this.playerRepository.findById(command.playerId);
    const game = await this.gameRepository.findByCode(command.code);

    if (player.gameId !== undefined) {
      throw new Error('player is already in a game');
    }

    if (game.state !== GameState.idle) {
      throw new Error('game is not idle');
    }

    player.gameId = game.id;

    await this.playerRepository.update(player);

    this.publisher.publish(new PlayerJoinedEvent(game.id, player.id));
  }
}
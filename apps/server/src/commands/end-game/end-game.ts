import assert from 'node:assert';

import { injectableClass } from 'ditox';

import { type EventPublisherPort } from 'src/adapters';
import { type Game, GameState, isStarted } from 'src/entities';
import { type CommandHandler, DomainEvent } from 'src/interfaces';
import { type GameRepository, type PlayerRepository } from 'src/persistence';
import { TOKENS } from 'src/tokens';

export class GameEndedEvent extends DomainEvent {
  constructor(gameId: string) {
    super('game', gameId);
  }
}

type EndGameCommand = {
  gameId: string;
};

export class EndGameHandler implements CommandHandler<EndGameCommand> {
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

  async execute(command: EndGameCommand): Promise<void> {
    const game = await this.gameRepository.findById(command.gameId);
    assert(isStarted(game), 'game is not started');

    const finishedGame: Game = {
      id: game.id,
      code: game.code,
      state: GameState.finished,
    };

    await this.gameRepository.update(finishedGame);

    this.publisher.publish(new GameEndedEvent(game.id));
  }
}

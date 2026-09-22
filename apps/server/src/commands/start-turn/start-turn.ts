import assert from 'node:assert';

import { injectableClass } from 'ditox';

import { type EventPublisherPort } from 'src/adapters';
import { isStarted } from 'src/entities';
import { type CommandHandler, DomainEvent } from 'src/interfaces';
import { type GameRepository, type QuestionRepository } from 'src/persistence';
import { TOKENS } from 'src/tokens';

export class TurnStartedEvent extends DomainEvent {
  constructor(gameId: string) {
    super('game', gameId);
  }
}

type StartTurnCommand = {
  gameId: string;
  questionMasterId: string;
};

export class StartTurnHandler implements CommandHandler<StartTurnCommand> {
  static inject = injectableClass(
    this,
    TOKENS.publisher,
    TOKENS.repositories.game,
    TOKENS.repositories.question,
  );

  constructor(
    private readonly publisher: EventPublisherPort,
    private readonly gameRepository: GameRepository,
    private readonly questionRepository: QuestionRepository,
  ) {}

  async execute(command: StartTurnCommand): Promise<void> {
    const game = await this.gameRepository.findById(command.gameId);
    assert(isStarted(game), 'game is not started');

    const nextQuestion = await this.questionRepository.findNextAvailableQuestion(game.id);
    assert(nextQuestion, 'there is no more question');

    game.questionMasterId = command.questionMasterId;
    game.questionId = nextQuestion.id;
    delete game.selectedAnswerId;

    await this.gameRepository.update(game);

    this.publisher.publish(new TurnStartedEvent(game.id));
  }
}

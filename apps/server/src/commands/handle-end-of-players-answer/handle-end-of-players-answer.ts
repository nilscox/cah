import { injectableClass } from 'ditox';

import { EventPublisherPort, RandomPort } from 'src/adapters';
import { CommandHandler, DomainEvent } from 'src/interfaces';
import { AnswerRepository, PlayerRepository } from 'src/persistence';
import { TOKENS } from 'src/tokens';

export class AllAnswersSubmittedEvent extends DomainEvent {
  constructor(gameId: string) {
    super('game', gameId);
  }
}

type HandleEndOfPlayersAnswerCommand = {
  answerId: string;
};

export class HandleEndOfPlayersAnswerHandler implements CommandHandler<HandleEndOfPlayersAnswerCommand> {
  static inject = injectableClass(
    this,
    TOKENS.publisher,
    TOKENS.random,
    TOKENS.repositories.player,
    TOKENS.repositories.answer,
  );

  constructor(
    private readonly publisher: EventPublisherPort,
    private readonly random: RandomPort,
    private readonly playerRepository: PlayerRepository,
    private readonly answerRepository: AnswerRepository,
  ) {}

  async execute(command: HandleEndOfPlayersAnswerCommand): Promise<void> {
    const answer = await this.answerRepository.findById(command.answerId);
    const players = await this.playerRepository.findAllByGameId(answer.gameId);
    const answers = await this.answerRepository.findForCurrentTurn(answer.gameId);

    if (answers.length !== players.length - 1) {
      return;
    }

    let place = 0;

    for (const answer of this.random.randomize(answers)) {
      answer.place = ++place;
    }

    await this.answerRepository.updateMany(answers);

    this.publisher.publish(new AllAnswersSubmittedEvent(answer.gameId));
  }
}

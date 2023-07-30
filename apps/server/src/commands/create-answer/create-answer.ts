import assert from 'node:assert';

import { hasId } from '@cah/utils';
import { injectableClass } from 'ditox';

import { EventPublisherPort, GeneratorPort } from 'src/adapters';
import { Answer, Choice, isStarted } from 'src/entities';
import { CommandHandler, DomainEvent } from 'src/interfaces';
import {
  AnswerRepository,
  ChoiceRepository,
  GameRepository,
  PlayerRepository,
  QuestionRepository,
} from 'src/persistence';
import { TOKENS } from 'src/tokens';

export class AnswerCreatedEvent extends DomainEvent {
  constructor(answerId: string) {
    super('answer', answerId);
  }
}

type CreateAnswerCommand = {
  playerId: string;
  choicesIds: string[];
};

export class CreateAnswerHandler implements CommandHandler<CreateAnswerCommand> {
  static inject = injectableClass(
    this,
    TOKENS.generator,
    TOKENS.publisher,
    TOKENS.repositories.game,
    TOKENS.repositories.player,
    TOKENS.repositories.question,
    TOKENS.repositories.choice,
    TOKENS.repositories.answer,
  );

  constructor(
    private readonly generator: GeneratorPort,
    private readonly publisher: EventPublisherPort,
    private readonly gameRepository: GameRepository,
    private readonly playerRepository: PlayerRepository,
    private readonly questionRepository: QuestionRepository,
    private readonly choiceRepository: ChoiceRepository,
    private readonly answerRepository: AnswerRepository,
  ) {}

  async execute(command: CreateAnswerCommand): Promise<void> {
    const player = await this.playerRepository.findById(command.playerId);
    assert(player.gameId, 'player is not in a game');

    const game = await this.gameRepository.findById(player.gameId);
    assert(isStarted(game), 'game is not started');
    assert(game.questionMasterId !== player.id, 'player is the question master');

    const answers = await this.answerRepository.findForCurrentTurn(player.gameId);
    const isPlayerAnswer = (answer: Answer) => answer.playerId === player.id;
    assert(!answers.some(isPlayerAnswer), 'player has already submitted an answer');

    const question = await this.questionRepository.findById(game.questionId);
    assert(command.choicesIds.length === (question.blanks?.length ?? 1), 'invalid number of choices');

    const playerCards = await this.choiceRepository.findPlayerCards(player.id);
    const choices: Choice[] = [];

    let place = 0;

    for (const choiceId of command.choicesIds) {
      const choice = playerCards.find(hasId(choiceId));
      assert(choice, 'player does not own some of the choices');

      delete choice.playerId;
      choice.place = ++place;

      choices.push(choice);
    }

    const answer: Answer = {
      id: this.generator.generateId(),
      gameId: game.id,
      playerId: player.id,
      questionId: game.questionId,
    };

    for (const choice of choices) {
      choice.answerId = answer.id;
    }

    await this.answerRepository.insert(answer);
    await this.choiceRepository.updateMany(choices);

    this.publisher.publish(new AnswerCreatedEvent(answer.id));
  }
}

import assert from 'node:assert';

import { injectableClass } from 'ditox';

import { EventPublisherPort, GeneratorPort } from 'src/adapters';
import { isStarted } from 'src/entities';
import { Turn } from 'src/entities/turn';
import { CommandHandler, DomainEvent } from 'src/interfaces';
import {
  AnswerRepository,
  GameRepository,
  PlayerRepository,
  QuestionRepository,
  TurnRepository,
} from 'src/persistence';
import { TOKENS } from 'src/tokens';

export class TurnEndedEvent extends DomainEvent {
  constructor(
    gameId: string,
    public readonly turnId: string,
    public readonly winnerId: string,
    public readonly hasMoreQuestions: boolean,
  ) {
    super('game', gameId);
  }
}

type EndTurnCommand = {
  playerId: string;
};

export class EndTurnHandler implements CommandHandler<EndTurnCommand> {
  static inject = injectableClass(
    this,
    TOKENS.generator,
    TOKENS.publisher,
    TOKENS.repositories.game,
    TOKENS.repositories.player,
    TOKENS.repositories.question,
    TOKENS.repositories.answer,
    TOKENS.repositories.turn,
  );

  constructor(
    private generator: GeneratorPort,
    private publisher: EventPublisherPort,
    private gameRepository: GameRepository,
    private playerRepository: PlayerRepository,
    private questionRepository: QuestionRepository,
    private answerRepository: AnswerRepository,
    private turnRepository: TurnRepository,
  ) {}

  async execute(command: EndTurnCommand): Promise<void> {
    const player = await this.playerRepository.findById(command.playerId);
    assert(player.gameId, 'player is not in a game');

    const game = await this.gameRepository.findById(player.gameId);
    assert(isStarted(game), 'game is not started');
    assert(game.selectedAnswerId !== undefined, 'no answer was selected');

    const answers = await this.answerRepository.findForCurrentTurn(game.id);

    const turn: Turn = {
      id: this.generator.generateId(),
      gameId: game.id,
      questionMasterId: game.questionMasterId,
      questionId: game.questionId,
      selectedAnswerId: game.selectedAnswerId,
    };

    for (const answer of answers) {
      answer.turnId = turn.id;
    }

    await this.turnRepository.insert(turn);
    await this.answerRepository.updateMany(answers);

    const winningAnswer = await this.answerRepository.findById(turn.selectedAnswerId);
    const nextQuestion = await this.questionRepository.findNextAvailableQuestion(game.id);

    this.publisher.publish(
      new TurnEndedEvent(game.id, turn.id, winningAnswer.playerId, nextQuestion !== undefined),
    );
  }
}

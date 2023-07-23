import assert from 'node:assert';

import { injectableClass } from 'ditox';

import { EventPublisherPort, ExternalDataPort, GeneratorPort, RandomPort } from 'src/adapters';
import { Choice, GameState, Question, isStarted } from 'src/entities';
import { CommandHandler, DomainEvent } from 'src/interfaces';
import { ChoiceRepository, GameRepository, PlayerRepository, QuestionRepository } from 'src/persistence';
import { TOKENS } from 'src/tokens';
import { sum } from 'src/utils/sum';

export class GameStartedEvent extends DomainEvent {
  constructor(
    gameId: string,
    public readonly initialQuestionMasterId: string,
  ) {
    super('game', gameId);
  }
}

type StartGameCommand = {
  playerId: string;
  numberOfQuestions: number;
};

export class StartGameHandler implements CommandHandler<StartGameCommand> {
  static inject = injectableClass(
    this,
    TOKENS.random,
    TOKENS.generator,
    TOKENS.publisher,
    TOKENS.externalData,
    TOKENS.repositories.game,
    TOKENS.repositories.player,
    TOKENS.repositories.question,
    TOKENS.repositories.choice,
  );

  constructor(
    private readonly random: RandomPort,
    private readonly generator: GeneratorPort,
    private readonly publisher: EventPublisherPort,
    private readonly externalData: ExternalDataPort,
    private readonly gameRepository: GameRepository,
    private readonly playerRepository: PlayerRepository,
    private readonly questionRepository: QuestionRepository,
    private readonly choiceRepository: ChoiceRepository,
  ) {}

  async execute(command: StartGameCommand): Promise<void> {
    const player = await this.playerRepository.findById(command.playerId);
    assert(player.gameId, 'player is not in a game');

    const game = await this.gameRepository.findById(player.gameId);
    assert(game.state === GameState.idle, 'game has already started');

    const players = await this.playerRepository.findAllByGameId(game.id);
    assert(players.length >= 3, 'there is not enough players to start (min: 3)');

    const questions = await this.getQuestions(game.id, command.numberOfQuestions);
    const choices = await this.getChoices(game.id, players.length, questions);

    await this.questionRepository.insertMany(questions);
    await this.choiceRepository.insertMany(choices);

    game.state = GameState.started;
    assert(isStarted(game));

    await this.gameRepository.update(game);

    const questionMasterId = this.random.randomItem(players).id;
    this.publisher.publish(new GameStartedEvent(game.id, questionMasterId));
  }

  private async getQuestions(gameId: string, numberOfQuestions: number): Promise<Question[]> {
    const questions = await this.externalData.getQuestions(numberOfQuestions);

    return questions.map((question) => ({
      id: this.generator.generateId(),
      gameId,
      ...question,
    }));
  }

  private async getChoices(
    gameId: string,
    numberOfPlayers: number,
    questions: Question[],
  ): Promise<Choice[]> {
    const numberOfChoices = this.computeNumberOfChoices(numberOfPlayers, 11, questions);
    const choices = await this.externalData.getChoices(numberOfChoices);

    return choices.map((choice) => ({
      id: this.generator.generateId(),
      gameId,
      ...choice,
    }));
  }

  private computeNumberOfChoices(
    numberOfPlayers: number,
    cardsPerPlayer: number,
    questions: Question[],
  ): number {
    const blanksCounts = sum(questions.map(({ blanks }) => blanks?.length ?? 1));

    return sum([cardsPerPlayer * numberOfPlayers, blanksCounts * (numberOfPlayers - 1)]);
  }
}

import { EventPublisherPort, ExternalDataPort, RandomPort } from 'src/adapters';
import { Choice, GameState, Question, isStarted } from 'src/entities';
import { CommandHandler, DomainEvent } from 'src/interfaces';
import { ChoiceRepository, GameRepository, PlayerRepository, QuestionRepository } from 'src/persistence';
import { sum } from 'src/utils/sum';

export class GameStartedEvent extends DomainEvent {
  constructor(gameId: string) {
    super('game', gameId);
  }
}

export class TurnStartedEvent extends DomainEvent {
  constructor(gameId: string) {
    super('game', gameId);
  }
}

type StartGameCommand = {
  gameId: string;
  numberOfQuestions: number;
};

export class StartGameHandler implements CommandHandler<StartGameCommand> {
  constructor(
    private readonly random: RandomPort,
    private readonly publisher: EventPublisherPort,
    private readonly externalData: ExternalDataPort,
    private readonly gameRepository: GameRepository,
    private readonly playerRepository: PlayerRepository,
    private readonly questionRepository: QuestionRepository,
    private readonly choiceRepository: ChoiceRepository
  ) {}

  async execute(command: StartGameCommand): Promise<void> {
    const game = await this.gameRepository.findByIdOrFail(command.gameId);
    const players = await this.playerRepository.findAllByGameId(game.id);

    if (game.state !== GameState.idle) {
      throw new Error('the game has already started');
    }

    if (players.length <= 2) {
      throw new Error('there is not enough players to start (min: 3)');
    }

    const questions = await this.getQuestions(game.id, command.numberOfQuestions);
    const choices = await this.getChoices(game.id, players.length, questions);

    game.state = GameState.started;
    assert(isStarted(game));

    game.questionMasterId = this.random.randomItem(players).id;
    game.questionId = questions[0].id;
    game.answers = [];

    await this.gameRepository.save(game);
    await this.questionRepository.save(...questions);
    await this.choiceRepository.save(...choices);

    this.publisher.publish(new GameStartedEvent(game.id));
  }

  private async getQuestions(gameId: string, numberOfQuestions: number): Promise<Question[]> {
    const questions = await this.externalData.getQuestions(numberOfQuestions);

    return questions.map((question) => ({
      ...question,
      gameId,
    }));
  }

  private async getChoices(
    gameId: string,
    numberOfPlayers: number,
    questions: Question[]
  ): Promise<Choice[]> {
    const numberOfChoices = this.computeNumberOfChoices(numberOfPlayers, 11, questions);
    const choices = await this.externalData.getChoices(numberOfChoices);

    return choices.map((choice) => ({
      ...choice,
      gameId,
    }));
  }

  private computeNumberOfChoices(
    numberOfPlayers: number,
    cardsPerPlayer: number,
    questions: Question[]
  ): number {
    const blanksCounts = sum(questions.map(({ blanks }) => blanks?.length ?? 1));

    return sum([cardsPerPlayer * numberOfPlayers, blanksCounts * (numberOfPlayers - 1)]);
  }
}

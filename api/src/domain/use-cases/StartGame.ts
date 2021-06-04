import { Inject, Service } from 'typedi';

import { Game, GameState, PlayState } from '../entities/Game';
import { Player } from '../entities/Player';
import { Question } from '../entities/Question';
import { GameAlreadyStartedError } from '../errors/GameAlreadyStartedError';
import { NotEnoughPlayersError } from '../errors/NotEnoughPlayersError';
import { ChoiceRepository, ChoiceRepositoryToken } from '../interfaces/ChoiceRepository';
import { GameEvents, GameEventsToken } from '../interfaces/GameEvents';
import { GameRepository, GameRepositoryToken } from '../interfaces/GameRepository';
import { QuestionRepository, QuestionRepositoryToken } from '../interfaces/QuestionRepository';
import { GameService } from '../services/GameService';

@Service()
export class StartGame {
  @Inject(QuestionRepositoryToken)
  private readonly questionRepository!: QuestionRepository;

  @Inject(ChoiceRepositoryToken)
  private readonly choiceRepository!: ChoiceRepository;

  @Inject(GameRepositoryToken)
  private readonly gameRepository!: GameRepository;

  @Inject(GameEventsToken)
  private readonly gameEvents!: GameEvents;

  @Inject()
  private readonly gameService!: GameService;

  async startGame(game: Game, questionMaster: Player, turns: number) {
    if (game.state !== GameState.idle) {
      throw new GameAlreadyStartedError();
    }

    if (game.players.length < 3) {
      throw new NotEnoughPlayersError(game.players.length, 3);
    }

    const questions = await this.questionRepository.pickRandomQuestions(turns);

    const nbChoices = this.computeNeededChoicesCount(game.players.length, questions);
    const choices = await this.choiceRepository.pickRandomChoices(nbChoices);

    await this.questionRepository.createQuestions(game, questions);
    await this.choiceRepository.createChoices(game, choices);

    const firstQuestion = (await this.questionRepository.getNextAvailableQuestion(game))!;

    game.state = GameState.started;
    game.playState = PlayState.playersAnswer;
    game.question = firstQuestion;
    game.questionMaster = questionMaster;
    game.answers = [];

    await this.gameRepository.save(game);

    await this.gameService.dealCards(game);

    this.gameEvents.broadcast(game, { type: 'GameStarted' });
    this.gameEvents.broadcast(game, { type: 'TurnStarted', questionMaster, question: firstQuestion });
  }

  private computeNeededChoicesCount(playersCount: number, questions: Question[]) {
    const sum = (a: number, b: number) => a + b;
    const totalNeededChoices = questions.map(({ neededChoices }) => neededChoices).reduce(sum, 0);

    return Game.cardsPerPlayer * playersCount + totalNeededChoices * (playersCount - 1);
  }
}

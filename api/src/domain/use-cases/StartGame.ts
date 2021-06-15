import { Inject, Service } from 'typedi';

import { Game, GameState, PlayState, StartedGame } from '../entities/Game';
import { Question } from '../entities/Question';
import { EntityNotFoundError } from '../errors/EntityNotFoundError';
import { GameAlreadyStartedError } from '../errors/GameAlreadyStartedError';
import { NotEnoughPlayersError } from '../errors/NotEnoughPlayersError';
import { ChoiceRepository, ChoiceRepositoryToken } from '../interfaces/ChoiceRepository';
import { ExternalData, ExternalDataToken } from '../interfaces/ExternalData';
import { GameEvents, GameEventsToken } from '../interfaces/GameEvents';
import { GameRepository, GameRepositoryToken } from '../interfaces/GameRepository';
import { QuestionRepository, QuestionRepositoryToken } from '../interfaces/QuestionRepository';
import { GameService } from '../services/GameService';
import { PlayerService } from '../services/PlayerService';

@Service()
export class StartGame {
  @Inject(ExternalDataToken)
  private readonly externalData!: ExternalData;

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

  @Inject()
  private readonly playerService!: PlayerService;

  async startGame(gameId: number, questionMasterId: number, numberOfTurns: number) {
    const game = await this.gameRepository.findOne(gameId);
    const questionMaster = await this.playerService.findPlayer(questionMasterId);

    if (!game) {
      throw new EntityNotFoundError('game', 'id', gameId);
    }

    if (game.state !== GameState.idle) {
      throw new GameAlreadyStartedError();
    }

    if (game.players.length < 3) {
      throw new NotEnoughPlayersError(game.players.length, 3);
    }

    const questions = await this.externalData.pickRandomQuestions(numberOfTurns);

    const nbChoices = this.computeNeededChoicesCount(game.players.length, questions);
    const choices = await this.externalData.pickRandomChoices(nbChoices);

    await this.questionRepository.createQuestions(game, questions);
    await this.choiceRepository.createChoices(game, choices);

    const firstQuestion = (await this.questionRepository.getNextAvailableQuestion(game))!;

    const startedGame = new StartedGame();

    startedGame.id = game.id;
    startedGame.code = game.code;
    startedGame.players = game.players;
    startedGame.state = GameState.started;
    startedGame.playState = PlayState.playersAnswer;
    startedGame.question = firstQuestion;
    startedGame.questionMaster = questionMaster;

    await this.gameRepository.save(startedGame);

    await this.gameService.dealCards(startedGame);

    this.gameEvents.onGameEvent(startedGame, { type: 'GameStarted' });
    this.gameEvents.onGameEvent(startedGame, { type: 'TurnStarted', questionMaster, question: firstQuestion });
  }

  private computeNeededChoicesCount(playersCount: number, questions: Question[]) {
    const sum = (a: number, b: number) => a + b;
    const totalNeededChoices = questions.map(({ neededChoices }) => neededChoices).reduce(sum, 0);

    return Game.cardsPerPlayer * playersCount + totalNeededChoices * (playersCount - 1);
  }
}

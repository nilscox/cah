import { Inject, Service } from 'typedi';

import { Game, GameState, PlayState } from '../entities/Game';
import { GameEvents, GameEventsToken } from '../interfaces/GameEvents';
import { GameRepository, GameRepositoryToken } from '../interfaces/GameRepository';
import { QuestionRepository, QuestionRepositoryToken } from '../interfaces/QuestionRepository';
import { TurnRepository, TurnRepositoryToken } from '../interfaces/TurnRepository';
import { GameService } from '../services/GameService';

@Service()
export class NextTurn {
  @Inject(GameRepositoryToken)
  private readonly gameRepository!: GameRepository;

  @Inject(QuestionRepositoryToken)
  private readonly questionRepository!: QuestionRepository;

  @Inject(TurnRepositoryToken)
  private readonly turnRepository!: TurnRepository;

  @Inject(GameEventsToken)
  private readonly gameEvents!: GameEvents;

  @Inject()
  private readonly gameService!: GameService;

  async nextTurn(game: Game) {
    const { questionMaster, question, answers, winner } = this.gameService.ensurePlayState(game, PlayState.endOfTurn);

    if (!winner) {
      throw new Error('Invalid state: winner should be defined');
    }

    const turn = await this.turnRepository.createTurn(game, questionMaster, question, answers, winner);

    await this.gameEvents.broadcast(game, { type: 'TurnEnded', turn });

    const nextQuestion = await this.questionRepository.getNextAvailableQuestion(game);

    if (!nextQuestion) {
      game.state = GameState.finished;
      game.playState = undefined;
      game.questionMaster = undefined;
      game.question = undefined;
      game.answers = [];
      game.winner = undefined;

      this.gameEvents.broadcast(game, {
        type: 'GameFinished',
      });
    } else {
      game.playState = PlayState.playersAnswer;
      game.questionMaster = winner;
      game.question = nextQuestion;
      game.answers = [];
      game.winner = undefined;

      await this.gameService.dealCards(game);

      this.gameEvents.broadcast(game, {
        type: 'TurnStarted',
        questionMaster: game.questionMaster,
        question: game.question,
      });
    }

    await this.gameRepository.save(game);
  }
}

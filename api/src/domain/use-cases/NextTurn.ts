import { Inject, Service } from 'typedi';

import { Game, GameState, PlayState } from '../entities/Game';
import { GameEvents, GameEventsToken } from '../interfaces/GameEvents';
import { GameRepository, GameRepositoryToken } from '../interfaces/GameRepository';
import { PlayerRepository, PlayerRepositoryToken } from '../interfaces/PlayerRepository';
import { QuestionRepository, QuestionRepositoryToken } from '../interfaces/QuestionRepository';
import { TurnRepository, TurnRepositoryToken } from '../interfaces/TurnRepository';
import { GameService } from '../services/GameService';

@Service()
export class NextTurn {
  @Inject(GameRepositoryToken)
  private readonly gameRepository!: GameRepository;

  @Inject(PlayerRepositoryToken)
  private readonly playerRepository!: PlayerRepository;

  @Inject(QuestionRepositoryToken)
  private readonly questionRepository!: QuestionRepository;

  @Inject(TurnRepositoryToken)
  private readonly turnRepository!: TurnRepository;

  @Inject(GameEventsToken)
  private readonly gameEvents!: GameEvents;

  @Inject()
  private readonly gameService!: GameService;

  async nextTurn(game: Game) {
    const { questionMaster, question, winner } = this.gameService.ensurePlayState(game, PlayState.endOfTurn);
    const answers = await this.gameRepository.getAnswers(game);

    if (!winner) {
      throw new Error('Invalid state: winner should be defined');
    }

    const turn = await this.turnRepository.createTurn(game, questionMaster, question, answers, winner);

    await this.gameEvents.onGameEvent(game, { type: 'TurnEnded', turn });

    const nextQuestion = await this.questionRepository.getNextAvailableQuestion(game);

    if (!nextQuestion) {
      game.state = GameState.finished;
      (game as any).playState = null;
      (game as any).questionMaster = null;
      (game as any).question = null;
      game.answers = [];
      (game as any).winner = null;

      for (const player of game.players) {
        await this.playerRepository.removeCards(player, player.cards);
      }

      this.gameEvents.onGameEvent(game, {
        type: 'GameFinished',
      });
    } else {
      game.playState = PlayState.playersAnswer;
      game.questionMaster = winner;
      game.question = nextQuestion;
      game.answers = [];
      (game as any).winner = null;

      await this.gameService.dealCards(game);

      this.gameEvents.onGameEvent(game, {
        type: 'TurnStarted',
        questionMaster: game.questionMaster,
        question: game.question,
      });
    }

    await this.gameRepository.save(game);
  }
}

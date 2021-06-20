import { Inject, Service } from 'typedi';

import { GameState, PlayState } from '../entities/Game';
import { Turn } from '../entities/Turn';
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

  async nextTurn(gameId: number) {
    const game = await this.gameService.findStartedGame(gameId);
    const answers = await this.gameRepository.getAnswers(game);
    const { questionMaster, question, winner } = game;

    this.gameService.ensurePlayState(game, PlayState.endOfTurn);

    if (!winner) {
      throw new Error('Invalid state: winner should be defined');
    }

    const turn = new Turn();

    turn.questionMaster = questionMaster;
    turn.question = question;
    turn.answers = answers;
    turn.winner = winner;
    turn.game = game;

    await this.turnRepository.save(turn);

    await this.gameEvents.onGameEvent(game, { type: 'TurnEnded', turn });

    const nextQuestion = await this.questionRepository.getNextAvailableQuestion(game);

    if (!nextQuestion) {
      game.state = GameState.finished;
      game.playState = undefined;
      game.questionMaster = undefined;
      game.question = undefined;
      game.winner = undefined;

      for (const player of game.players) {
        await this.playerRepository.removeCards(player, player.cards);
      }

      await this.gameRepository.clearAnswers(game);

      this.gameEvents.onGameEvent(game, {
        type: 'GameFinished',
      });
    } else {
      game.playState = PlayState.playersAnswer;
      game.questionMaster = winner;
      game.question = nextQuestion;
      game.winner = undefined;

      await this.gameRepository.clearAnswers(game);

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

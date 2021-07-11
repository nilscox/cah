import { Inject, Service } from 'typedi';

import { PlayState, StartedGame } from '../entities/Game';
import { Question } from '../entities/Question';
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

    this.gameService.ensurePlayState(game, PlayState.endOfTurn);

    game.answers = await this.gameRepository.getAnswers(game);

    await this.endCurrentTurn(game);

    const nextQuestion = await this.questionRepository.getNextAvailableQuestion(game);

    if (!nextQuestion) {
      await this.terminateGame(game);
    } else {
      await this.startNextTurn(game, nextQuestion);
    }
  }

  private async endCurrentTurn(game: StartedGame) {
    const turn = game.currentTurn;

    await this.turnRepository.save(turn);
    await this.gameEvents.onGameEvent(game, { type: 'TurnEnded', turn });
  }

  private async startNextTurn(game: StartedGame, nextQuestion: Question) {
    game.nextTurn(nextQuestion);

    await this.gameRepository.clearAnswers(game);
    await this.gameService.dealCards(game);

    this.gameEvents.onGameEvent(game, {
      type: 'TurnStarted',
      questionMaster: game.questionMaster,
      question: game.question,
    });

    await this.gameRepository.save(game);
  }

  private async terminateGame(game: StartedGame) {
    const finishedGame = game.end();

    for (const player of game.players) {
      await this.playerRepository.removeCards(player, player.cards);
    }

    await this.gameRepository.clearAnswers(game);
    await this.gameRepository.save(finishedGame);

    this.gameEvents.onGameEvent(finishedGame, {
      type: 'GameFinished',
    });
  }
}

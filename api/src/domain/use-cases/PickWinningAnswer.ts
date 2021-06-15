import { Inject, Service } from 'typedi';

import { PlayState } from '../entities/Game';
import { AnswerNotFoundError } from '../errors/AnswerNotFoundError';
import { IsNotQuestionMasterError } from '../errors/IsNotQuestionMasterError';
import { AnswerRepository, AnswerRepositoryToken } from '../interfaces/AnswerRepository';
import { GameEvents, GameEventsToken } from '../interfaces/GameEvents';
import { GameRepository, GameRepositoryToken } from '../interfaces/GameRepository';
import { GameService } from '../services/GameService';
import { PlayerService } from '../services/PlayerService';

@Service()
export class PickWinningAnswer {
  @Inject(GameRepositoryToken)
  private readonly gameRepository!: GameRepository;

  @Inject()
  private readonly playerService!: PlayerService;

  @Inject(AnswerRepositoryToken)
  private readonly answerRepository!: AnswerRepository;

  @Inject(GameEventsToken)
  private readonly gameEvents!: GameEvents;

  @Inject()
  private readonly gameService!: GameService;

  async pickWinningAnswer(gameId: number, playerId: number, answerId: number) {
    const game = await this.gameService.findStartedGame(gameId);
    const player = await this.playerService.findPlayer(playerId);
    const answers = await this.gameRepository.getAnswers(game);
    const { questionMaster } = game;

    this.gameService.ensurePlayState(game, PlayState.questionMasterSelection);

    if (!player.is(questionMaster)) {
      throw new IsNotQuestionMasterError();
    }

    const winningAnswer = await this.answerRepository.findOne(answerId);

    if (!winningAnswer) {
      throw new AnswerNotFoundError(answerId);
    }

    game.playState = PlayState.endOfTurn;
    game.winner = winningAnswer.player;

    await this.gameRepository.save(game);

    this.gameEvents.onGameEvent(game, { type: 'WinnerSelected', answers, winner: game.winner });
  }
}

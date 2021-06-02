import { Game, PlayState } from '../entities/Game';
import { Player } from '../entities/Player';
import { IsNotQuestionMasterError } from '../errors/IsNotQuestionMasterError';
import { GameEvents } from '../interfaces/GameEvents';
import { GameRepository } from '../interfaces/GameRepository';
import { GameService } from '../services/GameService';

export class PickWinningAnswer {
  constructor(
    private readonly gameRepository: GameRepository,
    private readonly gameService: GameService,
    private readonly gameEvents: GameEvents,
  ) {}

  async pickWinningAnswer(game: Game, player: Player, answerIndex: number) {
    const { questionMaster, answers } = this.gameService.ensurePlayState(game, PlayState.questionMasterSelection);

    if (!player.is(questionMaster)) {
      throw new IsNotQuestionMasterError();
    }

    const winningAnswer = answers[answerIndex];

    game.playState = PlayState.endOfTurn;
    game.winner = winningAnswer.player;

    await this.gameRepository.save(game);

    this.gameEvents.broadcast(game, { type: 'WinnerSelected', answers, winner: game.winner });
  }
}

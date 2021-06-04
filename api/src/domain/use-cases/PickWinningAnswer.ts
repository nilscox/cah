import { Inject, Service } from 'typedi';

import { Game, PlayState } from '../entities/Game';
import { Player } from '../entities/Player';
import { IsNotQuestionMasterError } from '../errors/IsNotQuestionMasterError';
import { GameEvents, GameEventsToken } from '../interfaces/GameEvents';
import { GameRepository, GameRepositoryToken } from '../interfaces/GameRepository';
import { GameService } from '../services/GameService';

@Service()
export class PickWinningAnswer {
  @Inject(GameRepositoryToken)
  private readonly gameRepository!: GameRepository;

  @Inject(GameEventsToken)
  private readonly gameEvents!: GameEvents;

  @Inject()
  private readonly gameService!: GameService;

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

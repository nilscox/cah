import { Inject, Service } from 'typedi';

import { Game, PlayState } from '../entities/Game';
import { Player } from '../entities/Player';
import { AnswerNotFoundError } from '../errors/AnswerNotFoundError';
import { IsNotQuestionMasterError } from '../errors/IsNotQuestionMasterError';
import { AnswerRepository, AnswerRepositoryToken } from '../interfaces/AnswerRepository';
import { GameEvents, GameEventsToken } from '../interfaces/GameEvents';
import { GameRepository, GameRepositoryToken } from '../interfaces/GameRepository';
import { GameService } from '../services/GameService';

@Service()
export class PickWinningAnswer {
  @Inject(GameRepositoryToken)
  private readonly gameRepository!: GameRepository;

  @Inject(AnswerRepositoryToken)
  private readonly answerRepository!: AnswerRepository;

  @Inject(GameEventsToken)
  private readonly gameEvents!: GameEvents;

  @Inject()
  private readonly gameService!: GameService;

  async pickWinningAnswer(game: Game, player: Player, answerId: number) {
    const { questionMaster } = this.gameService.ensurePlayState(game, PlayState.questionMasterSelection);
    const answers = await this.gameRepository.getAnswers(game);

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

    this.gameEvents.broadcast(game, { type: 'WinnerSelected', answers, winner: game.winner });
  }
}

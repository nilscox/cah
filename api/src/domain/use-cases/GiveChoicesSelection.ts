import { Inject, Service } from 'typedi';

import { Choice } from '../entities/Choice';
import { Game, PlayState } from '../entities/Game';
import { Player } from '../entities/Player';
import { AlreadyAnsweredError } from '../errors/AlreadyAnsweredError';
import { IncorrectNumberOfChoicesError } from '../errors/IncorrectNumberOfChoicesError';
import { InvalidChoicesSelectionError } from '../errors/InvalidChoicesSelectionError';
import { IsQuestionMasterError } from '../errors/IsQuestionMasterError';
import { AnswerRepository, AnswerRepositoryToken } from '../interfaces/AnswerRepository';
import { GameEvents, GameEventsToken } from '../interfaces/GameEvents';
import { GameRepository, GameRepositoryToken } from '../interfaces/GameRepository';
import { PlayerRepository, PlayerRepositoryToken } from '../interfaces/PlayerRepository';
import { GameService } from '../services/GameService';
import { RandomService, RandomServiceToken } from '../services/RandomService';

@Service()
export class GiveChoicesSelection {
  @Inject(PlayerRepositoryToken)
  private readonly playerRepository!: PlayerRepository;

  @Inject(GameRepositoryToken)
  private readonly gameRepository!: GameRepository;

  @Inject(AnswerRepositoryToken)
  private readonly answerRepository!: AnswerRepository;

  @Inject(RandomServiceToken)
  private readonly randomService!: RandomService;

  @Inject(GameEventsToken)
  private readonly gameEvents!: GameEvents;

  @Inject()
  private readonly gameService!: GameService;

  async giveChoicesSelection(game: Game, player: Player, selection: Choice[]) {
    const { questionMaster, question } = this.gameService.ensurePlayState(game, PlayState.playersAnswer);
    let answers = await this.gameRepository.getAnswers(game);

    if (player.is(questionMaster)) {
      throw new IsQuestionMasterError(player);
    }

    if (answers.some((answer) => answer.player.is(player))) {
      throw new AlreadyAnsweredError();
    }

    if (!selection.every((choice) => player.cards.some((card) => card.is(choice)))) {
      throw new InvalidChoicesSelectionError(player, selection);
    }

    if (selection.length !== question.neededChoices) {
      throw new IncorrectNumberOfChoicesError(selection.length, question.neededChoices);
    }

    await this.playerRepository.removeCards(player, selection);

    const answer = await this.answerRepository.createAnswer(player, selection);

    await this.gameRepository.addAnswer(game, answer);
    answers = await this.gameRepository.getAnswers(game);

    const allPlayersAnswered = answers.length === game.players.length - 1;

    if (allPlayersAnswered) {
      game.answers = this.randomService.randomize(answers);
      game.playState = PlayState.questionMasterSelection;
    }

    await this.gameRepository.save(game);

    this.gameEvents.broadcast(game, { type: 'PlayerAnswered', player });

    if (allPlayersAnswered) {
      this.gameEvents.broadcast(game, { type: 'AllPlayersAnswered', answers });
    }
  }
}

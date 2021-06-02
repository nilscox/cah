import { Answer } from '../entities/Answer';
import { Choice } from '../entities/Choice';
import { Game, PlayState } from '../entities/Game';
import { Player } from '../entities/Player';
import { AlreadyAnsweredError } from '../errors/AlreadyAnsweredError';
import { IncorrectNumberOfChoicesError } from '../errors/IncorrectNumberOfChoicesError';
import { InvalidChoicesSelectionError } from '../errors/InvalidChoicesSelectionError';
import { IsQuestionMasterError } from '../errors/IsQuestionMasterError';
import { GameEvents } from '../interfaces/GameEvents';
import { GameRepository } from '../interfaces/GameRepository';
import { PlayerRepository } from '../interfaces/PlayerRepository';
import { GameService } from '../services/GameService';
import { RandomService } from '../services/RandomService';

export class GiveChoicesSelection {
  constructor(
    private readonly playerRepository: PlayerRepository,
    private readonly gameRepository: GameRepository,
    private readonly gameService: GameService,
    private readonly randomService: RandomService,
    private readonly gameEvents: GameEvents,
  ) {}

  async giveChoicesSelection(game: Game, player: Player, selection: Choice[]) {
    const { questionMaster, question, answers } = this.gameService.ensurePlayState(game, PlayState.playersAnswer);

    if (player.is(questionMaster)) {
      throw new IsQuestionMasterError(player);
    }

    if (answers.some((answer) => answer.player.is(player))) {
      throw new AlreadyAnsweredError();
    }

    if (!selection.every((choice) => player.cards.includes(choice))) {
      throw new InvalidChoicesSelectionError(player, selection);
    }

    if (selection.length !== question.neededChoices) {
      throw new IncorrectNumberOfChoicesError(selection.length, question.neededChoices);
    }

    await this.playerRepository.removeCards(player, selection);

    const answer = new Answer();

    answer.player = player;
    answer.choices = selection;

    answers.push(answer);

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

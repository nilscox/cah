import { Inject, Service } from 'typedi';

import { Answer } from '../entities/Answer';
import { PlayState } from '../entities/Game';
import { AlreadyAnsweredError } from '../errors/AlreadyAnsweredError';
import { IncorrectNumberOfChoicesError } from '../errors/IncorrectNumberOfChoicesError';
import { InvalidChoicesSelectionError } from '../errors/InvalidChoicesSelectionError';
import { IsQuestionMasterError } from '../errors/IsQuestionMasterError';
import { AnswerRepository, AnswerRepositoryToken } from '../interfaces/AnswerRepository';
import { ChoiceRepository, ChoiceRepositoryToken } from '../interfaces/ChoiceRepository';
import { GameEvents, GameEventsToken } from '../interfaces/GameEvents';
import { GameRepository, GameRepositoryToken } from '../interfaces/GameRepository';
import { PlayerRepository, PlayerRepositoryToken } from '../interfaces/PlayerRepository';
import { GameService } from '../services/GameService';
import { PlayerService } from '../services/PlayerService';
import { RandomService, RandomServiceToken } from '../services/RandomService';

@Service()
export class GiveChoicesSelection {
  @Inject(PlayerRepositoryToken)
  private readonly playerRepository!: PlayerRepository;

  @Inject(GameRepositoryToken)
  private readonly gameRepository!: GameRepository;

  @Inject(ChoiceRepositoryToken)
  private readonly choiceRepository!: ChoiceRepository;

  @Inject(AnswerRepositoryToken)
  private readonly answerRepository!: AnswerRepository;

  @Inject(RandomServiceToken)
  private readonly randomService!: RandomService;

  @Inject(GameEventsToken)
  private readonly gameEvents!: GameEvents;

  @Inject()
  private readonly gameService!: GameService;

  @Inject()
  private readonly playerService!: PlayerService;

  async giveChoicesSelection(gameId: number, playerId: number, choicesIds: number[]) {
    const game = await this.gameService.findStartedGame(gameId);
    const { questionMaster, question } = game;

    this.gameService.ensurePlayState(game, PlayState.playersAnswer);

    const player = await this.playerService.findPlayer(playerId);

    if (player.is(questionMaster)) {
      throw new IsQuestionMasterError(player);
    }

    const selection = await this.choiceRepository.findByIds(choicesIds);
    let answers = await this.answerRepository.findForGame(game);

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

    const answer = new Answer();

    answer.player = player;
    answer.choices = selection;

    await this.answerRepository.save(answer);

    await this.answerRepository.setGame(answer, game);
    answers = await this.answerRepository.findForGame(game);

    const allPlayersAnswered = answers.length === game.players.length - 1;

    if (allPlayersAnswered) {
      answers = this.randomService.randomize(answers);
      answers.forEach((answer, index) => (answer.place = index + 1));

      await this.answerRepository.saveAll(answers);

      game.playState = PlayState.questionMasterSelection;
    }

    await this.gameRepository.save(game);

    this.gameEvents.onGameEvent(game, { type: 'PlayerAnswered', player });

    if (allPlayersAnswered) {
      this.gameEvents.onGameEvent(game, { type: 'AllPlayersAnswered', answers });
    }
  }
}

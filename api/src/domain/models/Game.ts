import { AggregateRoot } from '../../ddd/AggregateRoot';
import { EventPublisher } from '../../ddd/EventPublisher';
import { GameState } from '../enums/GameState';
import { PlayState } from '../enums/PlayState';
import { InvalidGameStateError } from '../errors/InvalidGameStateError';
import { InvalidNumberOfChoicesError } from '../errors/InvalidNumberOfChoicesError';
import { InvalidPlayStateError } from '../errors/InvalidPlayStateError';
import { NoMoreChoiceError } from '../errors/NoMoreChoiceError';
import { NotEnoughPlayersError } from '../errors/NotEnoughPlayersError';
import { PlayerAlreadyAnsweredError } from '../errors/PlayerAlreadyAnsweredError';
import { PlayerIsQuestionMasterError } from '../errors/PlayerIsQuestionMasterError';
import { AllPlayersAnsweredEvent } from '../events/AllPlayersAnsweredEvent';
import { GameStartedEvent } from '../events/GameStartedEvent';
import { PlayerAnsweredEvent } from '../events/PlayerAnsweredEvent';
import { TurnStartedEvent } from '../events/TurnStartedEvent';

import { Answer } from './Answer';
import { Choice } from './Choice';
import { Player } from './Player';
import { Question } from './Question';

type StartedGame = {
  playState: PlayState;
  questionMaster: Player;
  question: Question;
  answers: Answer[];
};

export class Game extends AggregateRoot {
  static cardPerPlayer = 11;
  static minimumPlayersToStart = 3;

  public state = GameState.idle;
  public players: Player[] = [];

  public playState?: PlayState;
  public questionMaster?: Player;
  public question?: Question;
  public answers?: Answer[];

  get playersExcludingQM() {
    return this.players.filter((player) => !player.equals(this.questionMaster));
  }

  override publishEvents(publisher: EventPublisher) {
    super.publishEvents(publisher);

    for (const player of this.players) {
      player.publishEvents(publisher);
    }
  }

  addPlayer(player: Player) {
    this.players.push(player);
  }

  computeNeededChoicesCount(questions: Question[]) {
    const sum = (a: number, b: number) => a + b;
    const totalNeededChoices = questions.map(({ numberOfBlanks }) => numberOfBlanks).reduce(sum, 0);
    const playersCount = this.players.length;

    return Game.cardPerPlayer * playersCount + totalNeededChoices * (playersCount - 1);
  }

  dealCards(availableChoices: Choice[]) {
    for (const player of this.players) {
      const needed = Game.cardPerPlayer - player.getCards().length;

      if (needed > availableChoices.length) {
        throw new NoMoreChoiceError();
      }

      if (needed > 0) {
        const cards = availableChoices.splice(0, needed);

        player.addCards(cards);
        // this.gameEvents.onPlayerEvent(player, { type: 'CardsDealt', cards });
      }
    }
  }

  ensureGameState(state: GameState) {
    if (this.state !== state) {
      throw new InvalidGameStateError(state, this.state);
    }
  }

  ensurePlayState(playState: PlayState) {
    this.ensureGameState(GameState.started);

    if (this.playState !== playState) {
      throw new InvalidPlayStateError(playState, this.playState!);
    }

    return this as StartedGame;
  }

  start(questionMaster: Player, question: Question) {
    this.ensureGameState(GameState.idle);

    if (this.players.length < Game.minimumPlayersToStart) {
      throw new NotEnoughPlayersError(Game.minimumPlayersToStart, this.players.length);
    }

    this.state = GameState.started;
    this.playState = PlayState.playersAnswer;
    this.questionMaster = questionMaster;
    this.question = question;
    this.answers = [];

    this.addEvent(new GameStartedEvent(this));
    this.addEvent(new TurnStartedEvent(this));
  }

  isQuestionMaster(player: Player) {
    return Boolean(this.questionMaster?.equals(player));
  }

  didAnswer(player: Player) {
    return this.answers?.some((answer) => answer.player.equals(player));
  }

  addAnswer(player: Player, choices: Choice[]) {
    const { question, answers } = this.ensurePlayState(PlayState.playersAnswer);

    if (this.isQuestionMaster(player)) {
      throw new PlayerIsQuestionMasterError(player);
    }

    if (this.didAnswer(player)) {
      throw new PlayerAlreadyAnsweredError(player);
    }

    if (choices.length !== question.numberOfBlanks) {
      throw new InvalidNumberOfChoicesError(question.numberOfBlanks, choices.length);
    }

    const answer = new Answer(player, question, choices);

    answers.push(answer);

    this.addEvent(new PlayerAnsweredEvent(this, player));

    if (answers.length === this.players.length - 1) {
      this.playState = PlayState.questionMasterSelection;
      this.addEvent(new AllPlayersAnsweredEvent(this));
    }
  }
}

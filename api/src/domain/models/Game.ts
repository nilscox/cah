import { AggregateRoot } from '../../ddd/AggregateRoot';
import { EventPublisher } from '../../ddd/EventPublisher';
import { GameState } from '../enums/GameState';
import { PlayState } from '../enums/PlayState';
import { AnswerNotFoundError } from '../errors/AnswerNotFoundError';
import { InvalidGameStateError } from '../errors/InvalidGameStateError';
import { InvalidNumberOfChoicesError } from '../errors/InvalidNumberOfChoicesError';
import { InvalidPlayStateError } from '../errors/InvalidPlayStateError';
import { NoMoreChoiceError } from '../errors/NoMoreChoiceError';
import { NotEnoughPlayersError } from '../errors/NotEnoughPlayersError';
import { PlayerAlreadyAnsweredError } from '../errors/PlayerAlreadyAnsweredError';
import { PlayerIsAlreadyInGameError } from '../errors/PlayerIsAlreadyInGameError';
import { PlayerIsNotQuestionMasterError } from '../errors/PlayerIsNotQuestionMasterError';
import { PlayerIsQuestionMasterError } from '../errors/PlayerIsQuestionMasterError';
import { AllPlayersAnsweredEvent } from '../events/AllPlayersAnsweredEvent';
import { GameCreatedEvent } from '../events/GameCreatedEvent';
import { GameFinishedEvent } from '../events/GameFinishedEvent';
import { GameJoinedEvent } from '../events/GameJoinedEvent';
import { GameStartedEvent } from '../events/GameStartedEvent';
import { PlayerAnsweredEvent } from '../events/PlayerAnsweredEvent';
import { TurnFinishedEvent } from '../events/TurnFinishedEvent';
import { TurnStartedEvent } from '../events/TurnStartedEvent';
import { WinnerSelectedEvent } from '../events/WinnerSelectedEvent';

import { Answer } from './Answer';
import { Choice } from './Choice';
import { Player } from './Player';
import { Question } from './Question';
import { Turn } from './Turn';

export class Game extends AggregateRoot {
  static cardPerPlayer = 11;
  static minimumPlayersToStart = 3;

  public code = Math.random().toString(36).slice(-4);
  public state = GameState.idle;
  public players: Player[] = [];

  public playState?: PlayState;
  public questionMaster?: Player;
  public question?: Question;
  public answers?: Answer[];
  public winner?: Player;

  constructor() {
    super();

    this.addEvent(new GameCreatedEvent(this));
  }

  get playersExcludingQM() {
    return this.players.filter((player) => !player.equals(this.questionMaster));
  }

  get currentTurn(): Turn {
    const { questionMaster, question, answers, winner } = this.ensurePlayState(PlayState.endOfTurn);

    return new Turn(questionMaster, question, answers, winner!);
  }

  override publishEvents(publisher: EventPublisher) {
    super.publishEvents(publisher);

    for (const player of this.players) {
      player.publishEvents(publisher);
    }
  }

  override dropEvents() {
    super.dropEvents();

    for (const player of this.players) {
      player.dropEvents();
    }
  }

  isStarted(): this is StartedGame {
    return this.state === GameState.started;
  }

  addPlayer(player: Player) {
    this.players.push(player);
    this.addEvent(new GameJoinedEvent(this, player));
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
      }
    }
  }

  ensureGameState(state: GameState) {
    if (this.state !== state) {
      throw new InvalidGameStateError(state, this.state);
    }
  }

  ensurePlayState(playState: PlayState): StartedGame {
    this.ensureGameState(GameState.started);

    if (this.playState !== playState) {
      throw new InvalidPlayStateError(playState, this.playState!);
    }

    return this as StartedGame;
  }

  start(questionMaster: Player, firstQuestion: Question) {
    this.ensureGameState(GameState.idle);

    if (this.players.length < Game.minimumPlayersToStart) {
      throw new NotEnoughPlayersError(Game.minimumPlayersToStart, this.players.length);
    }

    this.state = GameState.started;
    this.playState = PlayState.playersAnswer;
    this.questionMaster = questionMaster;
    this.question = firstQuestion;
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

  addAnswer(player: Player, choices: Choice[], randomize: <T>(array: T[]) => T[]) {
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

    player.removeCards(choices);

    const answer = new Answer(player, question, choices);

    answers.push(answer);

    this.addEvent(new PlayerAnsweredEvent(this, player));

    if (answers.length === this.players.length - 1) {
      this.answers = randomize(answers);
      this.playState = PlayState.questionMasterSelection;

      this.addEvent(new AllPlayersAnsweredEvent(this));
    }
  }

  setWinningAnswer(player: Player, answerId: string) {
    const { answers } = this.ensurePlayState(PlayState.questionMasterSelection);

    if (!player.equals(this.questionMaster)) {
      throw new PlayerIsNotQuestionMasterError(player);
    }

    const answer = answers.find((answer) => answer.id === answerId);

    if (!answer) {
      throw new AnswerNotFoundError();
    }

    this.playState = PlayState.endOfTurn;
    this.winner = answer.player;

    this.addEvent(new WinnerSelectedEvent(this));
  }

  nextTurn(nextQuestion: Question) {
    this.ensurePlayState(PlayState.endOfTurn);

    this.playState = PlayState.playersAnswer;
    this.questionMaster = this.winner;
    this.question = nextQuestion;
    this.answers = [];
    this.winner = undefined;

    this.addEvent(new TurnFinishedEvent(this));
    this.addEvent(new TurnStartedEvent(this));
  }

  finish() {
    this.ensurePlayState(PlayState.endOfTurn);

    this.state = GameState.finished;
    this.playState = undefined;
    this.questionMaster = undefined;
    this.question = undefined;
    this.answers = undefined;
    this.winner = undefined;

    for (const player of this.players) {
      player.removeCards(player.getCards());
    }

    this.addEvent(new TurnFinishedEvent(this));
    this.addEvent(new GameFinishedEvent(this));
  }
}

export class StartedGame extends Game {
  override playState!: PlayState;
  override questionMaster!: Player;
  override question!: Question;
  override answers!: Answer[];
}

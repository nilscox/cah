import { GameState, PlayState } from '../../../../shared/enums';
import { AggregateRoot } from '../../ddd/AggregateRoot';
import { AnswerNotFoundError } from '../errors/AnswerNotFoundError';
import { InvalidGameStateError } from '../errors/InvalidGameStateError';
import { InvalidNumberOfChoicesError } from '../errors/InvalidNumberOfChoicesError';
import { InvalidPlayStateError } from '../errors/InvalidPlayStateError';
import { NoMoreChoiceError } from '../errors/NoMoreChoiceError';
import { NotEnoughPlayersError } from '../errors/NotEnoughPlayersError';
import { PlayerAlreadyAnsweredError } from '../errors/PlayerAlreadyAnsweredError';
import { PlayerIsNotInTheGameError } from '../errors/PlayerIsNotInTheGame';
import { PlayerIsNotQuestionMasterError } from '../errors/PlayerIsNotQuestionMasterError';
import { PlayerIsQuestionMasterError } from '../errors/PlayerIsQuestionMasterError';
import { GameEvent } from '../events';
import { AllPlayersAnsweredEvent } from '../events/AllPlayersAnsweredEvent';
import { GameCreatedEvent } from '../events/GameCreatedEvent';
import { GameFinishedEvent } from '../events/GameFinishedEvent';
import { GameJoinedEvent } from '../events/GameJoinedEvent';
import { GameLeftEvent } from '../events/GameLeftEvent';
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

export class Game extends AggregateRoot<GameEvent> {
  public state = GameState.idle;
  public players: Player[] = [];

  public playState?: PlayState;
  public questionMaster?: Player;
  public question?: Question;
  public answers?: Answer[];
  public winner?: Player;

  constructor(id?: string, readonly code = '0000', readonly cardsPerPlayer = 11, readonly minimumPlayersToStart = 3) {
    super(id);

    this.addEvent(new GameCreatedEvent(this));
  }

  get playersExcludingQM() {
    return this.players.filter((player) => !player.equals(this.questionMaster));
  }

  get currentTurn(): Turn {
    const { questionMaster, question, answers, winner } = this.ensurePlayState(PlayState.endOfTurn);

    return new Turn(questionMaster, question, answers, winner!);
  }

  get roomId() {
    return `game-${this.id}`;
  }

  isStarted(): this is StartedGame {
    return this.state === GameState.started;
  }

  addPlayer(player: Player) {
    this.players.push(player);
    player.gameId = this.id;

    this.addEvent(new GameJoinedEvent(this, player));
  }

  removePlayer(player: Player) {
    if (this.state !== GameState.finished) {
      throw new InvalidGameStateError(GameState.finished, this.state);
    }

    const idx = this.players.findIndex((p) => p.equals(player));

    if (idx < 0) {
      return;
    }

    this.players.splice(idx, 1);
    player.gameId = undefined;

    this.addEvent(new GameLeftEvent(this, player));
  }

  hasPlayer(player: Player) {
    return Boolean(this.players.find((p) => p.equals(player)));
  }

  computeNeededChoicesCount(questions: Question[]) {
    const sum = (a: number, b: number) => a + b;
    const totalNeededChoices = questions.map(({ numberOfBlanks }) => numberOfBlanks).reduce(sum, 0);
    const playersCount = this.players.length;

    return (
      this.cardsPerPlayer * playersCount + totalNeededChoices * (playersCount - 1) + playersCount * this.cardsPerPlayer
    );
  }

  dealCards(availableChoices: Choice[]) {
    for (const player of this.players) {
      const needed = this.cardsPerPlayer - player.cards.length;

      if (needed > availableChoices.length) {
        throw new NoMoreChoiceError();
      }

      if (needed > 0) {
        const cards = availableChoices.splice(0, needed);

        for (const card of cards) {
          card.available = false;
        }

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

    if (!this.hasPlayer(questionMaster)) {
      throw new PlayerIsNotInTheGameError(this, questionMaster);
    }

    if (this.players.length < this.minimumPlayersToStart) {
      throw new NotEnoughPlayersError(this.minimumPlayersToStart, this.players.length);
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
      throw new AnswerNotFoundError({ id: answerId });
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
      player.removeCards(player.cards);
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

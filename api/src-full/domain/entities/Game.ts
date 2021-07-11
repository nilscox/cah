import { GameAlreadyStartedError } from '../errors/GameAlreadyStartedError';
import { NotEnoughPlayersError } from '../errors/NotEnoughPlayersError';

import { Answer } from './Answer';
import { Player } from './Player';
import { Question } from './Question';
import { Turn } from './Turn';

export enum GameState {
  idle = 'idle',
  started = 'started',
  finished = 'finished',
  paused = 'paused',
}

export enum PlayState {
  playersAnswer = 'playersAnswer',
  questionMasterSelection = 'questionMasterSelection',
  endOfTurn = 'endOfTurn',
}

export class Game {
  static readonly cardsPerPlayer = 11;

  id!: number;

  code!: string;
  state!: GameState;

  players!: Player[];

  start(questionMaster: Player, firstQuestion: Question): StartedGame {
    if (this.state !== GameState.idle) {
      throw new GameAlreadyStartedError();
    }

    if (this.players.length < 3) {
      throw new NotEnoughPlayersError(this.players.length, 3);
    }

    const startedGame = new StartedGame();

    startedGame.id = this.id;
    startedGame.code = this.code;
    startedGame.players = this.players;
    startedGame.state = GameState.started;
    startedGame.playState = PlayState.playersAnswer;
    startedGame.question = firstQuestion;
    startedGame.questionMaster = questionMaster;

    return startedGame;
  }
}

export class StartedGame extends Game {
  override state!: GameState.started;
  playState!: PlayState;
  questionMaster!: Player;
  question!: Question;
  winner?: Player;

  answers?: Answer[];

  get currentTurn() {
    const turn = new Turn();

    turn.questionMaster = this.questionMaster;
    turn.question = this.question;
    turn.answers = this.answers;
    turn.winner = this.winner;

    return turn;
  }

  nextTurn(nextQuestion: Question) {
    this.playState = PlayState.playersAnswer;
    this.questionMaster = this.winner!;
    this.question = nextQuestion;
    this.winner = undefined;
  }

  end() {
    const game = new Game();

    game.id = this.id;
    game.code = this.code;
    game.state = GameState.finished;
    game.players = this.players;

    return game;
  }
}

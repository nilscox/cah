import { AnonymousAnswer, Answer } from '../../domain/entities/Answer';
import { Choice } from '../../domain/entities/Choice';
import { Game, PlayState, StartedGame } from '../../domain/entities/Game';
import { Player } from '../../domain/entities/Player';
import { Question } from '../../domain/entities/Question';
import { Turn } from '../../domain/entities/Turn';
import { GameGateway } from '../../domain/gateways/GameGateway';
import { createGame, createQuestion } from '../factories';

import { FakeRTCGateway } from './FakeRTCGateway';

export class FakeGameGateway implements GameGateway {
  constructor(private readonly rtcGateway: FakeRTCGateway) {}

  game?: Game | StartedGame;

  async fetchGame(gameId: string): Promise<Game> {
    return this.game ?? createGame({ id: gameId, code: 'OK42' });
  }

  turns?: Turn[];

  async fetchTurns(_gameId: string): Promise<Turn[]> {
    return this.turns ?? [];
  }

  async createGame(): Promise<Game> {
    return this.game ?? createGame({ code: 'OK42' });
  }

  async joinGame(gameCode: string): Promise<Game> {
    return this.game ?? createGame({ code: gameCode });
  }

  async leaveGame(): Promise<void> {
    //
  }

  async startGame(questionMaster: Player, _turns: number): Promise<void> {
    this.rtcGateway.triggerMessage({ type: 'GameStarted' });

    this.rtcGateway.triggerMessage({
      type: 'TurnStarted',
      playState: PlayState.playersAnswer,
      question: createQuestion(),
      questionMaster: questionMaster.nick,
    });
  }

  async flushCards(): Promise<void> {
    //
  }

  answers?: Answer[];
  answered?: Choice[];

  async answer(choices: Choice[]): Promise<void> {
    this.answered = choices;

    // todo
    this.rtcGateway.triggerMessage({
      type: 'PlayerAnswered',
      player: 'player',
    });

    if (this.answers) {
      this.rtcGateway.triggerMessage({
        type: 'AllPlayersAnswered',
        answers: this.answers,
      });
    }
  }

  winningAnswer?: AnonymousAnswer;
  winner?: Player;

  async selectWinningAnswer(answer: AnonymousAnswer): Promise<void> {
    if (!this.winner) {
      throw new Error('winner is not set');
    }

    this.winningAnswer = answer;

    this.rtcGateway.triggerMessage({
      type: 'WinnerSelected',
      winner: this.winner.nick,
      answers: [
        {
          id: answer.id,
          choices: answer.choices,
          formatted: answer.formatted,
          player: this.winner.nick,
        },
      ],
    });
  }

  nextQuestionMaster?: Player;
  nextQuestion?: Question;
  turnEnded = false;

  async endCurrentTurn(): Promise<void> {
    this.turnEnded = true;

    this.rtcGateway.triggerMessage({
      type: 'TurnFinished',
    });

    if (this.nextQuestionMaster && this.nextQuestion) {
      this.rtcGateway.triggerMessage({
        type: 'TurnStarted',
        playState: PlayState.playersAnswer,
        questionMaster: this.nextQuestionMaster.nick,
        question: this.nextQuestion,
      });
    } else {
      this.rtcGateway.triggerMessage({
        type: 'GameFinished',
      });
    }
  }
}

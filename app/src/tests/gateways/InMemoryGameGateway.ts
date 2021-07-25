import { Answer } from '../../domain/entities/Answer';
import { Choice } from '../../domain/entities/Choice';
import { Game, PlayState, StartedGame } from '../../domain/entities/Game';
import { Player } from '../../domain/entities/Player';
import { GameGateway } from '../../domain/gateways/GameGateway';
import { createGame, createQuestion } from '../factories';

import { InMemoryRTCGateway } from './InMemoryRTCGateway';

export class InMemoryGameGateway implements GameGateway {
  constructor(private readonly rtcGateway: InMemoryRTCGateway) {}

  game?: Game | StartedGame;

  async fetchGame(gameId: string): Promise<Game> {
    return this.game ?? createGame({ id: gameId, code: 'OK42' });
  }

  async createGame(): Promise<Game> {
    return this.game ?? createGame({ code: 'OK42' });
  }

  async joinGame(gameCode: string): Promise<Game> {
    return this.game ?? createGame({ code: gameCode });
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

  answer(_choices: Choice[]): Promise<void> {
    throw new Error('Method not implemented.');
  }

  selectWinningAnswer(_answer: Answer): Promise<void> {
    throw new Error('Method not implemented.');
  }

  endCurrentTurn(): Promise<void> {
    throw new Error('Method not implemented.');
  }
}

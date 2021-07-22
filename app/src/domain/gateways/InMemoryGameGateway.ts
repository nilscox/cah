import { Answer } from '../../interfaces/entities/Answer';
import { Choice } from '../../interfaces/entities/Choice';
import { Game, PlayState } from '../../interfaces/entities/Game';
import { Player } from '../../interfaces/entities/Player';
import { GameGateway } from '../../interfaces/gateways/GameGateway';
import { createGame, createQuestion } from '../../utils/factories';

import { InMemoryRTCGateway } from './InMemoryRTCGateway';

export class InMemoryGameGateway implements GameGateway {
  constructor(private readonly rtcGateway: InMemoryRTCGateway) {}

  async fetchGame(gameId: string): Promise<Game> {
    return createGame({ id: gameId });
  }

  async createGame(): Promise<Game> {
    return createGame({ code: 'OK42' });
  }

  async joinGame(gameCode: string): Promise<Game> {
    return createGame({ code: gameCode });
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

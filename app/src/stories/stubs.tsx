import { action } from '@storybook/addon-actions';

import { Answer } from '../interfaces/entities/Answer';
import { Choice } from '../interfaces/entities/Choice';
import { Game } from '../interfaces/entities/Game';
import { Player } from '../interfaces/entities/Player';
import { GameGateway } from '../interfaces/gateways/GameGateway';
import { PlayerGateway } from '../interfaces/gateways/PlayerGateway';
import { RTCGateway } from '../interfaces/gateways/RTCGateway';
import { createGame, createPlayer } from '../utils/factories';

export class StubGameGateway implements GameGateway {
  fetchGame(gameId: string): Promise<Game> {
    throw new Error('Method not implemented.');
  }

  async createGame(): Promise<Game> {
    action('create game')({});
    return createGame();
  }

  async joinGame(gameCode: string): Promise<Game> {
    action('create game')(gameCode);
    return createGame({ code: gameCode });
  }

  startGame(questionMaster: Player, turns: number): Promise<void> {
    throw new Error('Method not implemented.');
  }

  answer(choices: Choice[]): Promise<void> {
    throw new Error('Method not implemented.');
  }

  selectWinningAnswer(answer: Answer): Promise<void> {
    throw new Error('Method not implemented.');
  }

  endCurrentTurn(): Promise<void> {
    throw new Error('Method not implemented.');
  }
}

export class StubPlayerGateway implements PlayerGateway {
  fetchMe(): Promise<Player | undefined> {
    throw new Error('Method not implemented.');
  }

  async login(nick: string): Promise<Player> {
    action('login')(nick);
    return createPlayer({ nick });
  }
}

export class StubRTCGateway implements RTCGateway {
  connect(): Promise<void> {
    throw new Error('Method not implemented.');
  }
}

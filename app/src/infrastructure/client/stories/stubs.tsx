import { action } from '@storybook/addon-actions';
import { createMemoryHistory } from 'history';

import { Answer } from '../../../domain/entities/Answer';
import { Choice } from '../../../domain/entities/Choice';
import { Game } from '../../../domain/entities/Game';
import { Player } from '../../../domain/entities/Player';
import { GameGateway } from '../../../domain/gateways/GameGateway';
import { PlayerGateway } from '../../../domain/gateways/PlayerGateway';
import { RouterGateway } from '../../../domain/gateways/RouterGateway';
import { RTCGateway, RTCListener } from '../../../domain/gateways/RTCGateway';
import { ServerGateway } from '../../../domain/gateways/ServerGateway';
import { TimerGateway } from '../../../domain/gateways/TimerGateway';
import { ServerStatus } from '../../../store/reducers/appStateReducer';
import { Dependencies } from '../../../store/types';
import { createGame, createPlayer } from '../../../tests/factories';
import { ReactRouterGateway } from '../../gateways/ReactRouterGateway';
import { gameRouterHistory } from '../views/GameView/GameView';

export class StubGameGateway implements GameGateway {
  fetchGame(_gameId: string): Promise<Game> {
    throw new Error('Method not implemented.');
  }

  async createGame(): Promise<Game> {
    action('create game')({});
    return createGame();
  }

  async joinGame(gameCode: string): Promise<Game> {
    action('join game')(gameCode);
    return createGame({ code: gameCode });
  }

  async startGame(questionMaster: Player, turns: number): Promise<void> {
    action('start game')({ questionMaster, turns });
  }

  async answer(choices: Choice[]): Promise<void> {
    action('answer')({ choices });
  }

  async selectWinningAnswer(answer: Answer): Promise<void> {
    action('selectWinningAnswer')({ answer });
  }

  async endCurrentTurn(): Promise<void> {
    action('endCurrentTurn')({});
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

  onMessage(_listener: RTCListener): void {
    throw new Error('Method not implemented.');
  }
}

export class StubRouterGateway implements RouterGateway {
  pathname = '/';

  push(to: string): void {
    action('history.push')(to);
  }
}

export class StubTimerGateway implements TimerGateway {
  setInterval(callback: () => void, ms: number): NodeJS.Timer {
    throw new Error('Method not implemented.');
  }

  clearInterval(interval: NodeJS.Timer): void {
    throw new Error('Method not implemented.');
  }
}

export class StubServerGateway implements ServerGateway {
  healthcheck(): Promise<ServerStatus> {
    throw new Error('Method not implemented.');
  }
}

export const storiesRouterHistory = createMemoryHistory();

export const dependencies: Dependencies = {
  gameGateway: new StubGameGateway(),
  playerGateway: new StubPlayerGateway(),
  rtcGateway: new StubRTCGateway(),
  routerGateway: new StubRouterGateway(),
  gameRouterGateway: new StubRouterGateway(),
  timerGateway: new StubTimerGateway(),
  serverGateway: new StubServerGateway(),
};

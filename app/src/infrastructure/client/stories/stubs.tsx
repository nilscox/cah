import { action } from '@storybook/addon-actions';
import { createMemoryHistory, History } from 'history';

import { Answer } from '../../../domain/entities/Answer';
import { Choice } from '../../../domain/entities/Choice';
import { Game, StartedGame } from '../../../domain/entities/Game';
import { FullPlayer, Player } from '../../../domain/entities/Player';
import { Turn } from '../../../domain/entities/Turn';
import { GameGateway } from '../../../domain/gateways/GameGateway';
import { PlayerGateway } from '../../../domain/gateways/PlayerGateway';
import { RouterGateway } from '../../../domain/gateways/RouterGateway';
import { RTCGateway, RTCListener } from '../../../domain/gateways/RTCGateway';
import { ServerGateway } from '../../../domain/gateways/ServerGateway';
import { TimerGateway } from '../../../domain/gateways/TimerGateway';
import { ServerStatus } from '../../../store/reducers/appStateReducer';
import { createFullPlayer, createGame } from '../../../tests/factories';
import { ReactRouterGateway } from '../../gateways/ReactRouterGateway';
import { gameRouterHistory } from '../views/GameView/GameView';

const log = true;

class ActionLogger {
  log(name: string, ...args: unknown[]) {
    if (log) {
      action(name)(args);
    }
  }
}

export class StubGameGateway extends ActionLogger implements GameGateway {
  game?: Game | StartedGame;

  async fetchGame(gameId: string): Promise<Game | undefined> {
    this.log('fetch game', gameId, '=>', this.game);
    return this.game;
  }

  turns?: Turn[];

  async fetchTurns(_gameId: string): Promise<Turn[]> {
    return this.turns ?? [];
  }

  async createGame(): Promise<Game> {
    this.log('create game');
    return createGame();
  }

  async joinGame(gameCode: string): Promise<Game> {
    this.log('join game', { gameCode });
    return createGame({ code: gameCode });
  }

  async leaveGame(): Promise<void> {
    this.log('leave game');
  }

  async startGame(questionMaster: Player, turns: number): Promise<void> {
    this.log('start game', { questionMaster, turns });
  }

  async flushCards() {
    this.log('flush cards');
  }

  async answer(choices: Choice[]): Promise<void> {
    this.log('answer', { choices });
  }

  async selectWinningAnswer(answer: Answer): Promise<void> {
    this.log('selectWinningAnswer', { answer });
  }

  async endCurrentTurn(): Promise<void> {
    this.log('endCurrentTurn');
  }
}

export class StubPlayerGateway extends ActionLogger implements PlayerGateway {
  player?: FullPlayer;

  async fetchMe(): Promise<FullPlayer | undefined> {
    this.log('fetch me', '=>', this.player);
    return this.player;
  }

  async login(nick: string): Promise<FullPlayer> {
    this.log('login', { nick });
    return createFullPlayer({ nick });
  }
}

export class StubRTCGateway extends ActionLogger implements RTCGateway {
  async connect(): Promise<void> {
    this.log('connect');
  }

  // eslint-disable-next-line @typescript-eslint/no-empty-function
  onMessage(_listener: RTCListener): void {}
}

export interface StubHistory extends History {
  goto(pathname: string): void;
}

export function createStubHistory(): StubHistory {
  const memoryHistory = createMemoryHistory();

  const onEvent =
    (event: string) =>
    (...args: unknown[]) => {
      log && action(event)(args);
    };

  const { replace, ...rest } = memoryHistory;

  return {
    ...rest,
    goto: replace.bind(memoryHistory),
    push: onEvent('push'),
    replace: onEvent('replace'),
    go: onEvent('go'),
    goBack: onEvent('goBack'),
    goForward: onEvent('goForward'),
  };
}

export class StubRouterGateway extends ActionLogger implements RouterGateway {
  pathname = '/';

  push(to: string): void {
    this.log('history.push', { to });
  }
}

export class StubTimerGateway implements TimerGateway {
  setInterval(_callback: () => void, _ms: number): NodeJS.Timer {
    throw new Error('Method not implemented.');
  }

  clearInterval(_interval: NodeJS.Timer): void {
    throw new Error('Method not implemented.');
  }
}

export class StubServerGateway implements ServerGateway {
  healthcheck(): Promise<ServerStatus> {
    throw new Error('Method not implemented.');
  }
}

// export const storiesRouterHistory = createStubHistory();
export const storiesRouterHistory = createMemoryHistory();

export const stubDependencies = () => ({
  gameGateway: new StubGameGateway(),
  playerGateway: new StubPlayerGateway(),
  rtcGateway: new StubRTCGateway(),
  routerGateway: new ReactRouterGateway(storiesRouterHistory),
  gameRouterGateway: new ReactRouterGateway(gameRouterHistory),
  timerGateway: new StubTimerGateway(),
  serverGateway: new StubServerGateway(),
});

import expect from 'expect';

import { rtcMessage } from '../domain/actions';
import { FakeServerGateway } from '../domain/gateways/FakeServerGateway';
import { FakeTimerGateway } from '../domain/gateways/FakeTimerGateway';
import { InMemoryGameGateway } from '../domain/gateways/InMemoryGameGateway';
import { InMemoryPlayerGateway } from '../domain/gateways/InMemoryPlayerGateway';
import { InMemoryRouterGateway } from '../domain/gateways/InMemoryRouterGateway';
import { InMemoryRTCGateway } from '../domain/gateways/InMemoryRTCGateway';

import { configureStore } from './index';
import { AppState, AppStore, Dependencies } from './types';

export class InMemoryStore {
  store: AppStore;
  state: AppState;

  get dispatch() {
    return this.store.dispatch;
  }

  get getState() {
    return this.store.getState;
  }

  rtcGateway = new InMemoryRTCGateway();
  playerGateway = new InMemoryPlayerGateway();
  gameGateway = new InMemoryGameGateway(this.rtcGateway);
  routerGateway = new InMemoryRouterGateway();
  timerGateway = new FakeTimerGateway();
  serverGateway = new FakeServerGateway();

  constructor(overrides: Partial<Dependencies> = {}) {
    this.store = configureStore({ ...this, ...overrides });
    this.state = this.store.getState();
  }

  listenRTCMessages(rtcGateway = this.rtcGateway) {
    rtcGateway.onMessage((message) => this.store.dispatch(rtcMessage(message)));
  }

  snapshot() {
    this.state = this.store.getState();
  }

  expectState<S extends keyof AppState>(state: S, expected: AppState[S]) {
    expect(this.store.getState()[state]).toEqual(expected);
  }

  expectPartialState<S extends keyof AppState>(state: S, expected: Partial<AppState[S]>) {
    expect(this.store.getState()[state]).toEqual({ ...this.state[state], ...expected });
  }
}

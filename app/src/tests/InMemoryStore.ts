import { expect } from 'earljs';

import { handleRTCMessage } from '../domain/usecases/game/handleRTCMessage/handleRTCMessage';
import { configureStore } from '../store/configureStore';
import { AppState, AppStore, Dependencies } from '../store/types';

import { FakeNetworkGateway } from './gateways/FakeNetworkGateway';
import { FakeServerGateway } from './gateways/FakeServerGateway';
import { FakeTimerGateway } from './gateways/FakeTimerGateway';
import { InMemoryGameGateway } from './gateways/InMemoryGameGateway';
import { InMemoryPersistenceGateway } from './gateways/InMemoryPersistenceGateway';
import { InMemoryPlayerGateway } from './gateways/InMemoryPlayerGateway';
import { InMemoryRouterGateway } from './gateways/InMemoryRouterGateway';
import { InMemoryRTCGateway } from './gateways/InMemoryRTCGateway';

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
  networkGateway = new FakeNetworkGateway();
  serverGateway = new FakeServerGateway();
  persistenceGateway = new InMemoryPersistenceGateway();

  constructor(overrides: Partial<Dependencies> = {}) {
    this.store = configureStore({ ...this, ...overrides });
    this.state = this.store.getState();
  }

  listenRTCMessages = (rtcGateway = this.rtcGateway) => {
    rtcGateway.onMessage((message) => this.store.dispatch(handleRTCMessage(message)));
  };

  setup(cb: (store: InMemoryStore) => void) {
    cb(this);
  }

  expectState<S extends keyof AppState>(state: S, expected: AppState[S]) {
    expect(this.store.getState()[state]).toEqual(expected);
  }

  expectPartialState<S extends keyof AppState>(state: S, expected: Partial<AppState[S]>) {
    expect(this.store.getState()[state] as unknown).toBeAnObjectWith(expected);
  }
}

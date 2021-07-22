import expect from 'expect';

import { FakeServerGateway } from '../domain/gateways/FakeServerGateway';
import { FakeTimerGateway } from '../domain/gateways/FakeTimerGateway';
import { InMemoryGameGateway } from '../domain/gateways/InMemoryGameGateway';
import { InMemoryPlayerGateway } from '../domain/gateways/InMemoryPlayerGateway';
import { InMemoryRouterGateway } from '../domain/gateways/InMemoryRouterGateway';
import { InMemoryRTCGateway } from '../domain/gateways/InMemoryRTCGateway';

import { configureStore } from './index';
import { AppState, AppStore, Dependencies } from './types';

export const inMemoryStore = (overrides: Partial<Dependencies> = {}) => {
  return configureStore({
    playerGateway: new InMemoryPlayerGateway(),
    gameGateway: new InMemoryGameGateway(),
    rtcGateway: new InMemoryRTCGateway(),
    routerGateway: new InMemoryRouterGateway(),
    timerGateway: new FakeTimerGateway(),
    serverGateway: new FakeServerGateway(),
    ...overrides,
  });
};

export const expectState = <S extends keyof AppState>(store: AppStore, state: S, expected: AppState[S]) => {
  expect(store.getState()[state]).toEqual(expected);
};

export const expectPartialState = <S extends keyof AppState>(
  store: AppStore,
  state: S,
  expected: Partial<AppState[S]>,
) => {
  expectState(store, state, expect.objectContaining(expected) as AppState[S]);
};

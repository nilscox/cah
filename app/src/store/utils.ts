import expect from 'expect';

import { InMemoryGameGateway } from '../domain/gateways/InMemoryGameGateway';
import { InMemoryPlayerGateway } from '../domain/gateways/InMemoryPlayerGateway';
import { InMemoryRouterGateway } from '../domain/gateways/InMemoryRouterGateway';
import { InMemoryRTCGateway } from '../domain/gateways/InMemoryRTCGateway';

import { AppState, AppStore, Dependencies } from './types';

import { configureStore } from '.';

export const inMemoryStore = (overrides: Partial<Dependencies> = {}) => {
  const playerGateway = new InMemoryPlayerGateway();
  const gameGateway = new InMemoryGameGateway();
  const rtcGateway = new InMemoryRTCGateway();
  const routerGateway = new InMemoryRouterGateway();

  return configureStore({ playerGateway, gameGateway, rtcGateway, routerGateway, ...overrides });
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

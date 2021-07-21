import expect from 'expect';

import { AppState, AppStore } from './types';

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

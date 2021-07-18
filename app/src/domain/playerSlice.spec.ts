import expect from 'expect';

import { createStore, Store } from '../store/index';

import { setNick } from './playerSlice';

describe('playerSlice', () => {
  let store: Store;

  beforeEach(() => {
    store = createStore();
  });

  it('initializes a player', () => {
    const state = store.getState();

    expect(state).toEqual({
      player: {
        nick: '',
      },
    });
  });

  it("sets a player's nick", () => {
    store.dispatch(setNick('Toto'));

    expect(store.getState().player).toEqual({
      nick: 'Toto',
    });
  });
});

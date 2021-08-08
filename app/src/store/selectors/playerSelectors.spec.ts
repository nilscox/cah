import expect from 'expect';

import { setPlayer } from '../../domain/actions';
import { createFullPlayer } from '../../tests/factories';
import { InMemoryStore } from '../../tests/InMemoryStore';

import { selectCanFlushCards } from './playerSelectors';

describe('playerSelectors', () => {
  describe('selectCanFlushCards', () => {
    it('allows the player to flush his cards', () => {
      const store = new InMemoryStore();

      store.dispatch(setPlayer(createFullPlayer({ hasFlushed: false })));

      expect(selectCanFlushCards(store.getState())).toBe(true);
    });
  });
});

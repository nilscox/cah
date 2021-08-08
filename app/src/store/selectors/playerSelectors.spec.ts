import expect from 'expect';

import { selectionValidated, setGame, setPlayer } from '../../domain/actions';
import { PlayState } from '../../domain/entities/Game';
import { createFullPlayer, createStartedGame } from '../../tests/factories';
import { InMemoryStore } from '../../tests/InMemoryStore';

import { selectCanFlushCards } from './playerSelectors';

describe('playerSelectors', () => {
  describe('selectCanFlushCards', () => {
    it('allows the player to flush his cards', () => {
      const store = new InMemoryStore();

      store.dispatch(setPlayer(createFullPlayer({ hasFlushed: false })));
      store.dispatch(setGame(createStartedGame({ playState: PlayState.playersAnswer })));

      expect(selectCanFlushCards(store.getState())).toBe(true);
    });

    it('prevents the player to flush his cards when the play state is not players answer', () => {
      for (const playState of [PlayState.questionMasterSelection, PlayState.endOfTurn]) {
        const store = new InMemoryStore();

        store.dispatch(setPlayer(createFullPlayer()));
        store.dispatch(setGame(createStartedGame({ playState })));

        expect(selectCanFlushCards(store.getState())).toBe(false);
      }
    });

    it('prevents the player to flush his cards when he has validated his selection', () => {
      const store = new InMemoryStore();

      store.dispatch(setGame(createStartedGame({ playState: PlayState.playersAnswer })));
      store.dispatch(setPlayer(createFullPlayer()));
      store.dispatch(selectionValidated());

      expect(selectCanFlushCards(store.getState())).toBe(false);
    });
  });
});

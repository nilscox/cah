import { createAnswer, createStartedGame } from '@cah/shared';

import { TestStore } from '../../test-store';

import { selectCanSelectChoice } from './player.selectors';

describe('player selectors', () => {
  let store: TestStore;

  beforeEach(() => {
    store = new TestStore();

    store.setPlayer();
    store.setGame(createStartedGame());
  });

  describe('can select choice', () => {
    test('player can select a choice', () => {
      expect(store.select(selectCanSelectChoice)).toBe(true);
    });

    test('player is question master', () => {
      store.setGame(createStartedGame({ questionMaster: store.getPlayer() }));

      expect(store.select(selectCanSelectChoice)).toBe(false);
    });

    test('game play state is not playersAnswer', () => {
      store.setGame(createStartedGame({ answers: [createAnswer()] }));

      expect(store.select(selectCanSelectChoice)).toBe(false);
    });
  });
});

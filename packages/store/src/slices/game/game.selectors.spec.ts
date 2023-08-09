import { createAnonymousAnswer, createAnswer, createPlayer, createStartedGame } from '@cah/shared';

import { TestStore } from '../../test-store';

import { gameSelectors } from './game.selectors';
import { PlayState } from './game.slice';

describe('game selectors', () => {
  let store: TestStore;

  beforeEach(() => {
    store = new TestStore();

    store.setPlayer(createPlayer());
    store.setGame(createStartedGame());
  });

  describe('playState', () => {
    it('players answer', () => {
      expect(store.select(gameSelectors.playState)).toEqual(PlayState.playersAnswer);
    });

    it('question master selection', () => {
      store.setGame(
        createStartedGame({
          answers: [createAnonymousAnswer()],
        }),
      );

      expect(store.select(gameSelectors.playState)).toEqual(PlayState.questionMasterSelection);
    });

    it('end of turn', () => {
      store.setGame(
        createStartedGame({
          answers: [createAnswer({ playerId: 'playerId' })],
        }),
      );

      expect(store.select(gameSelectors.playState)).toEqual(PlayState.endOfTurn);
    });
  });
});

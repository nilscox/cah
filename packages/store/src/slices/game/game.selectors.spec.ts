import { createAnonymousAnswer, createAnswer, createStartedGame } from '@cah/shared';

import { TestStore } from '../../test-store';

import { selectPlayState } from './game.selectors';
import { PlayState } from './game.slice';

describe('game selectors', () => {
  let store: TestStore;

  beforeEach(() => {
    store = new TestStore();

    store.setPlayer();
    store.setGame(createStartedGame());
  });

  describe('playState', () => {
    it('players answer', () => {
      expect(store.select(selectPlayState)).toEqual(PlayState.playersAnswer);
    });

    it('question master selection', () => {
      store.setGame(
        createStartedGame({
          answers: [createAnonymousAnswer()],
        }),
      );

      expect(store.select(selectPlayState)).toEqual(PlayState.questionMasterSelection);
    });

    it('end of turn', () => {
      store.setGame(
        createStartedGame({
          answers: [createAnswer({ playerId: 'playerId' })],
        }),
      );

      expect(store.select(selectPlayState)).toEqual(PlayState.endOfTurn);
    });
  });
});

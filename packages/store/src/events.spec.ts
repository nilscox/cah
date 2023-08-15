import { GameState, createChoice, createCurrentPlayer } from '@cah/shared';

import { selectAllChoices } from './slices/choices/choices.selectors';
import { TestStore } from './test-store';

describe('events', () => {
  let store: TestStore;

  beforeEach(() => {
    store = new TestStore();
  });

  test('cards-dealt', () => {
    store.setPlayer(createCurrentPlayer({ cards: [] }));
    store.setGame({ state: GameState.started });

    const choice = createChoice({ id: 'choiceId1', text: 'text', caseSensitive: false });

    store.dispatchEvent({
      type: 'cards-dealt',
      playerId: '',
      cards: [choice],
    });

    expect(store.select(selectAllChoices)).toEqual([choice]);
  });
});

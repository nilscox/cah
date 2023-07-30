import { GameState, createChoice } from '@cah/shared';

import { choicesSelectors } from './slices/choices/choices.selectors';
import { playersSelectors } from './slices/players/players.selectors';
import { TestStore } from './test-store';

describe('events', () => {
  let store: TestStore;

  beforeEach(() => {
    store = new TestStore();
  });

  test('player-joined', () => {
    store.setPlayer();
    store.setGame();

    store.dispatchEvent({
      type: 'player-joined',
      playerId: 'playerId',
      nick: 'nick',
    });

    expect(store.select(playersSelectors.all)).toEqual([
      {
        id: 'playerId',
        nick: 'nick',
      },
    ]);

    expect(store.getGame()).toHaveProperty('playersIds', ['playerId']);
  });

  test('player-left', () => {
    store.setPlayer();
    store.setGame({ players: [{ id: 'playerId', nick: 'nick' }] });

    store.dispatchEvent({
      type: 'player-left',
      playerId: 'playerId',
    });

    expect(store.select(playersSelectors.all)).toEqual([]);
    expect(store.getGame()).toHaveProperty('playersIds', []);
  });

  test('cards-dealt', () => {
    store.setPlayer();
    store.setGame({ state: GameState.started });

    const choice = createChoice({ id: 'choiceId1', text: 'text', caseSensitive: false });

    store.dispatchEvent({
      type: 'cards-dealt',
      playerId: '',
      cards: [choice],
    });

    expect(store.select(choicesSelectors.all)).toEqual([choice]);
  });
});

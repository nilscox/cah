import {
  GameStartedEvent,
  GameState,
  PlayerJoinedEvent,
  PlayerLeftEvent,
  TurnStartedEvent,
} from '@cah/shared';

import { gameSelectors } from './slices/game.slice';
import { playersSelectors } from './slices/players.slice';
import { TestStore } from './test-store';

describe('events', () => {
  let store: TestStore;

  beforeEach(() => {
    store = new TestStore();
  });

  test('player-joined', () => {
    store.setPlayer();
    store.setGame();

    store.dispatch({
      type: 'player-joined',
      playerId: 'playerId',
      nick: 'nick',
    } satisfies PlayerJoinedEvent);

    expect(store.select(playersSelectors.all)).toEqual([
      {
        id: 'playerId',
        nick: 'nick',
      },
    ]);

    expect(store.getGame()).toHaveProperty('players', ['playerId']);
  });

  test('player-left', () => {
    store.setPlayer();
    store.setGame({ players: [{ id: 'playerId', nick: 'nick' }] });

    store.dispatch({
      type: 'player-left',
      playerId: 'playerId',
    } satisfies PlayerLeftEvent);

    expect(store.select(playersSelectors.all)).toEqual([]);
    expect(store.getGame()).toHaveProperty('players', []);
  });

  test('game-started', () => {
    store.setPlayer();
    store.setGame({ state: GameState.idle });

    store.dispatch({
      type: 'game-started',
      gameId: '',
    } satisfies GameStartedEvent);

    expect(store.getGame()).toHaveProperty('state', GameState.started);
  });

  test('turn-started', () => {
    store.setPlayer();
    store.setGame({ state: GameState.started });

    store.dispatch({
      type: 'turn-started',
      gameId: '',
      questionMasterId: 'questionMasterId',
      question: {
        id: 'questionId',
        text: '',
        blanks: [],
      },
    } satisfies TurnStartedEvent);

    expect(store.getGame()).toHaveProperty('questionMasterId', 'questionMasterId');
    expect(store.getGame()).toHaveProperty('questionId', 'questionId');
    expect(store.getGame()).toHaveProperty('answersIds', []);
  });
});

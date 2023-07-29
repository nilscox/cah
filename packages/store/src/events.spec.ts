import {
  GameStartedEvent,
  GameState,
  PlayerJoinedEvent,
  PlayerLeftEvent,
  Question,
  TurnStartedEvent,
  createQuestion,
} from '@cah/shared';

import { playersSelectors } from './slices/players/players.selectors';
import { questionsSelectors } from './slices/questions/questions.selectors';
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

    const question = createQuestion({
      id: 'questionId',
      text: '',
      blanks: [],
    });

    store.dispatch({
      type: 'turn-started',
      gameId: '',
      questionMasterId: 'questionMasterId',
      question,
    } satisfies TurnStartedEvent);

    expect(store.getGame()).toHaveProperty('questionMasterId', 'questionMasterId');
    expect(store.getGame()).toHaveProperty('questionId', 'questionId');
    expect(store.getGame()).toHaveProperty('answersIds', []);

    expect(store.select(questionsSelectors.all)).toEqual<Question[]>([question]);
  });
});

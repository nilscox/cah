import { Choice, GameState, Question, createChoice, createQuestion } from '@cah/shared';

import { choicesSelectors } from './slices/choices/choices.selectors';
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

    expect(store.getGame()).toHaveProperty('players', ['playerId']);
  });

  test('player-left', () => {
    store.setPlayer();
    store.setGame({ players: [{ id: 'playerId', nick: 'nick' }] });

    store.dispatchEvent({
      type: 'player-left',
      playerId: 'playerId',
    });

    expect(store.select(playersSelectors.all)).toEqual([]);
    expect(store.getGame()).toHaveProperty('players', []);
  });

  test('game-started', () => {
    store.setPlayer();
    store.setGame({ state: GameState.idle });

    store.dispatchEvent({
      type: 'game-started',
      gameId: '',
    });

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

    store.dispatchEvent({
      type: 'turn-started',
      gameId: '',
      questionMasterId: 'questionMasterId',
      question,
    });

    expect(store.getGame()).toHaveProperty('questionMasterId', 'questionMasterId');
    expect(store.getGame()).toHaveProperty('questionId', 'questionId');
    expect(store.getGame()).toHaveProperty('answersIds', []);

    expect(store.select(questionsSelectors.all)).toEqual<Question[]>([question]);
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

    expect(store.select(choicesSelectors.all)).toEqual<Choice[]>([choice]);
  });
});

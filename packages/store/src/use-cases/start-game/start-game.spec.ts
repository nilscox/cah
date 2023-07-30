import { GameState, Question, createQuestion } from '@cah/shared';

import { isStarted } from '../../slices/game/game.slice';
import { questionsSelectors } from '../../slices/questions/questions.selectors';
import { TestStore } from '../../test-store';

import { startGame } from './start-game';

describe('startGame', () => {
  let store: TestStore;

  beforeEach(() => {
    store = new TestStore();

    store.setPlayer();
    store.setGame();
  });

  it('starts a game', async () => {
    await store.dispatch(startGame(3));

    expect(store.client.startGame).toHaveBeenCalledWith(3);
  });

  it('handles a game-started event', () => {
    store.setPlayer();
    store.setGame({ state: GameState.idle });

    store.dispatchEvent({
      type: 'game-started',
      gameId: '',
    });

    expect(store.getGame()).toHaveProperty('state', GameState.started);
    expect(store.getGame()).toHaveProperty('answersIds', []);
    expect(store.getGame()).toHaveProperty('isAnswerValidated', false);
  });

  it('handles a turn-started event', () => {
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

    const game = store.getGame();
    assert(isStarted(game));

    expect(game).toHaveProperty('questionMasterId', 'questionMasterId');
    expect(game).toHaveProperty('questionId', 'questionId');

    expect(store.select(questionsSelectors.byId, game.questionId)).toEqual<Question>(question);
  });
});
import { GameState, createQuestion } from '@cah/shared';

import { gameSelectors } from '../../slices/game/game.selectors';
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

    const game = store.getGame();
    expect(game).toHaveProperty('state', GameState.started);
    expect(game).toHaveProperty('answersIds', []);
    expect(game).toHaveProperty('isAnswerValidated', false);

    const player = store.getPlayer();
    expect(player).toHaveProperty('cardsIds', []);
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
    expect(game).toHaveProperty('questionMasterId', 'questionMasterId');
    expect(game).toHaveProperty('questionId', 'questionId');

    expect(store.select(gameSelectors.currentQuestion)).toEqual(question);

    const player = store.getPlayer();
    expect(player).toHaveProperty('selectedChoicesIds', [null]);
  });
});

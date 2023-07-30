import { GameState, createAnswer, createStartedGame } from '@cah/shared';

import { answersActions } from '../../slices/answers/answers.slice';
import { gameActions } from '../../slices/game/game.slice';
import { TestStore } from '../../test-store';

import { endTurn } from './end-turn';

describe('endTurn', () => {
  let store: TestStore;

  beforeEach(() => {
    store = new TestStore();

    store.setPlayer();
    store.setGame(createStartedGame());
  });

  it('ends the current turn', async () => {
    await store.dispatch(endTurn());

    expect(store.client.endTurn).toHaveBeenCalledWith();
  });

  it('handles a turn-ended event', () => {
    store.dispatch(answersActions.add(createAnswer()));
    store.dispatch(gameActions.setSelectedAnswer('answerId'));
    store.dispatch(gameActions.setAnswerValidated());

    store.dispatchEvent({
      type: 'turn-ended',
    });

    const game = store.getGame();

    expect(game).toHaveProperty('answersIds', []);
    expect(game).not.toHaveProperty('selectedAnswerId');
    expect(game).toHaveProperty('isAnswerValidated', false);
  });

  it('handles a game-ended event', () => {
    store.dispatchEvent({
      type: 'game-ended',
    });

    const game = store.getGame();

    expect(game).toHaveProperty('state', GameState.finished);
    expect(game).not.toHaveProperty('questionMasterId');
    expect(game).not.toHaveProperty('questionId');
    expect(game).not.toHaveProperty('answersIds');
    expect(game).not.toHaveProperty('isAnswerValidated');
    expect(game).not.toHaveProperty('selectedAnswerId');
  });
});

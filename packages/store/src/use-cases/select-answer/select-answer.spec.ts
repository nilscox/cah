import { createAnswer, createStartedGame } from '@cah/shared';

import { selectAnswerById } from '../../slices/answers/answers.selectors';
import { answersActions } from '../../slices/answers/answers.slice';
import { gameActions } from '../../slices/game/game.slice';
import { TestStore } from '../../test-store';

import { selectAnswer } from './select-answer';

describe('validateSelectedAnswer', () => {
  let store: TestStore;

  beforeEach(() => {
    store = new TestStore();

    store.setPlayer();
    store.setGame(createStartedGame());
  });

  it('selects an answer', async () => {
    store.dispatch(gameActions.setSelectedAnswerId('answerId'));

    await store.dispatch(selectAnswer('answerId'));

    expect(store.client.selectAnswer).toHaveBeenCalledWith('answerId');
  });

  it('handles a winning-answer-selected event', () => {
    const answer = createAnswer({
      id: 'answerId',
      playerId: 'playerId',
    });

    store.dispatch(answersActions.add({ id: 'answerId', choices: [] }));

    store.dispatchEvent({
      type: 'winning-answer-selected',
      selectedAnswerId: 'answerId',
      answers: [answer],
    });

    expect(store.getGame()).toHaveProperty('selectedAnswerId', 'answerId');

    expect(store.select(selectAnswerById, 'answerId')).toHaveProperty('playerId', 'playerId');
  });
});

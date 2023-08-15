import { createAnonymousAnswer, createStartedGame } from '@cah/shared';

import { selectAnswerById } from '../../slices/answers/answers.selectors';
import { answersActions } from '../../slices/answers/answers.slice';
import { gameActions } from '../../slices/game/game.slice';
import { TestStore } from '../../test-store';

import { validateSelectedAnswer } from './validate-selected-answer';

describe('validateSelectedAnswer', () => {
  let store: TestStore;

  beforeEach(() => {
    store = new TestStore();

    store.setPlayer();
    store.setGame(createStartedGame());
  });

  it('selects an answer', async () => {
    store.dispatch(gameActions.setSelectedAnswer('answerId'));

    await store.dispatch(validateSelectedAnswer());

    expect(store.client.selectAnswer).toHaveBeenCalledWith('answerId');
  });

  it('handles a winning-answer-selected event', () => {
    const answer = createAnonymousAnswer({
      id: 'answerId',
    });

    store.dispatch(answersActions.add({ id: 'answerId', choices: [] }));

    store.dispatchEvent({
      type: 'winning-answer-selected',
      selectedAnswerId: 'answerId',
      answers: [{ ...answer, playerId: 'playerId' }],
    });

    expect(store.getGame()).toHaveProperty('selectedAnswerId', 'answerId');
    expect(store.getGame()).toHaveProperty('isAnswerValidated', true);

    expect(store.select(selectAnswerById, 'answerId')).toHaveProperty('playerId', 'playerId');
  });
});

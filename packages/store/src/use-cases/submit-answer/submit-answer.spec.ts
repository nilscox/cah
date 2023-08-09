import { Choice, createChoice, createStartedGame } from '@cah/shared';

import { choicesActions } from '../../slices/choices/choices.slice';
import { playerActions } from '../../slices/player/player.slice';
import { TestStore } from '../../test-store';

import { submitAnswer } from './submit-answer';

describe('submitAnswer', () => {
  let store: TestStore;
  let choices: Choice[];

  beforeEach(() => {
    store = new TestStore();

    choices = [createChoice({ id: 'choiceId1' }), createChoice({ id: 'choiceId2' })];

    store.setPlayer({ cards: choices });
    store.setGame(createStartedGame());

    store.dispatch(choicesActions.add(choices[0]));
    store.dispatch(choicesActions.add(choices[1]));
  });

  it('submits the current selection of choices', async () => {
    store.dispatch(playerActions.setSelectedChoice(['choiceId1', 0]));
    await store.dispatch(submitAnswer());

    expect(store.client.createAnswer).toHaveBeenCalledWith(['choiceId1']);
  });
});

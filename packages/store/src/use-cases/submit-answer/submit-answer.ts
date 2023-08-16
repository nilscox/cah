import { assert } from '@cah/utils';

import { selectedSelectedChoices } from '../../slices/player/player.selectors';
import { playerActions } from '../../slices/player/player.slice';
import { createThunk } from '../../store/create-thunk';

export const submitAnswer = createThunk(async ({ client, dispatch, getState }) => {
  const selectedChoices = selectedSelectedChoices(getState());

  const choicesIds = selectedChoices.map((choice) => {
    assert(choice);
    return choice.id;
  });

  await client.createAnswer(choicesIds);

  dispatch(playerActions.answerSubmitted());
});

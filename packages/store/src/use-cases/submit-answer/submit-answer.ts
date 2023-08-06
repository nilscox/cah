import { playerSelectors } from '../../slices/player/player.selectors';
import { playerActions } from '../../slices/player/player.slice';
import { createThunk2 } from '../../store/create-thunk';

export const submitAnswer = createThunk2(async ({ client, dispatch, getState }) => {
  const selectedChoices = playerSelectors.selectedChoices(getState());

  const choicesIds = selectedChoices.map((choice) => {
    assert(choice);
    return choice.id;
  });

  await client.createAnswer(choicesIds);

  dispatch(playerActions.removeCards(choicesIds));
});

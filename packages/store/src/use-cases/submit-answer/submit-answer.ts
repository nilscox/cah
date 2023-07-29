import { playerSelectors } from '../../slices/player/player.selectors';
import { playerActions } from '../../slices/player/player.slice';
import { createThunk } from '../../store/create-thunk';

export const submitAnswer = createThunk('submit-answer', async ({ client, dispatch, getState }) => {
  const choices = playerSelectors.selectedChoices(getState());
  const choicesIds = choices.map((choice) => choice.id);

  await client.createAnswer(choicesIds);

  dispatch(playerActions.removeCards(choicesIds));
});

import { choicesSelectionSelector } from '../../../../infrastructure/client/hooks/usePlayer';
import { createThunk } from '../../../../store/createThunk';
import { selectionValidated } from '../../../actions';

export const validateChoicesSelection = createThunk(async ({ dispatch, getState, gameGateway }) => {
  const state = getState();
  const selection = choicesSelectionSelector(state);

  await gameGateway.answer(selection);

  dispatch(selectionValidated());
});

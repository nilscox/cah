import { createThunk } from '../../../../store/createThunk';
import { selectChoicesSelection } from '../../../../store/selectors/playerSelectors';
import { selectionValidated } from '../../../actions';

export const validateChoicesSelection = createThunk(async ({ dispatch, getState, gameGateway }) => {
  const state = getState();
  const selection = selectChoicesSelection(state);

  await gameGateway.answer(selection);

  dispatch(selectionValidated());
});

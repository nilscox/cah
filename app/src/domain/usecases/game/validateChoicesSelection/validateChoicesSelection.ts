import { createThunk } from '../../../../store/createThunk';
import { selectionValidated } from '../../../actions';
import { selectChoicesSelection, selectPlayerCards } from '../../../selectors/playerSelectors';
import { setCards } from '../../player/setCards/setCards';

export const validateChoicesSelection = createThunk(async ({ dispatch, getState, gameGateway }) => {
  const state = getState();
  const cards = selectPlayerCards(state);
  const selection = selectChoicesSelection(state);

  await gameGateway.answer(selection);

  dispatch(selectionValidated());
  dispatch(setCards(cards.filter((card) => !selection.includes(card))));
});

import { createThunk } from '../../../../store/createThunk';
import { selectChoicesSelection, selectPlayerCards } from '../../../../store/selectors/playerSelectors';
import { selectionValidated } from '../../../actions';
import { setCards } from '../../player/setCards/setCards';

export const validateChoicesSelection = createThunk(async ({ dispatch, getState, gameGateway }) => {
  const state = getState();
  const cards = selectPlayerCards(state);
  const selection = selectChoicesSelection(state);

  await gameGateway.answer(selection);

  dispatch(selectionValidated());
  dispatch(setCards(cards.filter((card) => !selection.includes(card))));
});

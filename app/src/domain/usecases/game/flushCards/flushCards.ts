import { createThunk } from '../../../../store/createThunk';
import { cardsFlushed, setPlayerCards } from '../../../actions';
import { showNotification } from '../../app/showNotification/showNotification';

export const flushCards = createThunk(async ({ dispatch, gameGateway }) => {
  dispatch(setPlayerCards([]));

  await gameGateway.flushCards();

  dispatch(cardsFlushed());
  dispatch(showNotification('Nouvelles cartes reçues !'));
});

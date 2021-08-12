import { createThunk } from '../../../../store/createThunk';
import { cardsFlushed } from '../../../actions';
import { showNotification } from '../../app/showNotification/showNotification';
import { setCards } from '../../player/setCards/setCards';

export const flushCards = createThunk(async ({ dispatch, gameGateway }) => {
  dispatch(setCards([]));

  await gameGateway.flushCards();

  dispatch(cardsFlushed());
  dispatch(showNotification('Nouvelles cartes reçues !'));
});

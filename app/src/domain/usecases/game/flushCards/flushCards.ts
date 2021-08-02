import { createThunk } from '../../../../store/createThunk';
import { setPlayerCards } from '../../../actions';
import { showNotification } from '../../app/showNotification/showNotification';

export const flushCards = createThunk(async ({ dispatch, gameGateway }) => {
  dispatch(setPlayerCards([]));

  await gameGateway.flushCards();

  dispatch(showNotification('Nouvelles cartes reçues !'));
});

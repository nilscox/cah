import { createThunk } from '../../../../store/createThunk';
import { playerActions } from '../../../../store/slices/player/player.actions';
import { showNotification } from '../../app/showNotification/showNotification';
import { setCards } from '../../player/setCards/setCards';

export const flushCards = createThunk(async ({ dispatch, gameGateway }) => {
  dispatch(setCards([]));

  await gameGateway.flushCards();

  dispatch(playerActions.setCardsFlushed());
  dispatch(showNotification('Nouvelles cartes reçues !'));
});

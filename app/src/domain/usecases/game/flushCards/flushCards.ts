import { createThunk } from '../../../../store/createThunk';
import { setPlayerCards } from '../../../actions';

export const flushCards = createThunk(async ({ dispatch, gameGateway }) => {
  dispatch(setPlayerCards([]));

  await gameGateway.flushCards();
});

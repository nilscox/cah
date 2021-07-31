import { createThunk } from '../../../../store/createThunk';
import { setGame } from '../../../actions';

export const leaveGame = createThunk(async ({ dispatch, gameGateway, routerGateway }) => {
  await gameGateway.leaveGame();

  dispatch(setGame(null));
  routerGateway.push('/');
});

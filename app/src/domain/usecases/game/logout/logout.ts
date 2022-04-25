import { createThunk } from '../../../../store/createThunk';
import { setGame, unsetPlayer } from '../../../actions';

export const logout = createThunk(async ({ dispatch, playerGateway, routerGateway }) => {
  await playerGateway.logout();

  routerGateway.push('/login');

  dispatch(unsetPlayer());
  dispatch(setGame(null));
});

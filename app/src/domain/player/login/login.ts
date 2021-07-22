import { createThunk } from '../../../store/createThunk';
import { setPlayer } from '../../actions';

export const login = createThunk(async ({ dispatch, playerGateway, routerGateway }, nick: string) => {
  const player = await playerGateway.login(nick);

  dispatch(setPlayer(player));
  routerGateway.push('/');
});

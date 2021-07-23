import { createThunk } from '../../../store/createThunk';
import { setPlayer } from '../../actions';
import { connect } from '../connect/connect';

export const login = createThunk(async ({ dispatch, playerGateway, routerGateway }, nick: string) => {
  const player = await playerGateway.login(nick);

  dispatch(setPlayer(player));
  await dispatch(connect());

  routerGateway.push('/');
});

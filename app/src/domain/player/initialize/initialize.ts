import { Player } from '../../../interfaces/entities/Player';
import { RouterGateway } from '../../../interfaces/gateways/RouterGateway';
import { createThunk } from '../../../store/createThunk';
import { setAppReady, setGame, setPlayer } from '../../actions';
import { connect } from '../connect/connect';

const redirect = (router: RouterGateway, player?: Player) => {
  const { pathname } = router;

  if (player && pathname === '/login') {
    router.push('/');
  }

  if (!player && pathname !== '/login') {
    router.push('/login');
  }

  if (!player?.gameId && pathname.startsWith('/game')) {
    router.push('/');
  }
};

export const initialize = createThunk(async ({ dispatch, playerGateway, gameGateway, routerGateway }) => {
  const player = await playerGateway.fetchMe();

  if (player) {
    dispatch(setPlayer(player));
    await dispatch(connect());
  }

  if (player?.gameId) {
    dispatch(setGame(await gameGateway.fetchGame(player.gameId)));
  }

  redirect(routerGateway, player);
  dispatch(setAppReady());
});

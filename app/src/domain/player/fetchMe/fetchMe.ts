import { Player } from '../../../interfaces/entities/Player';
import { RouterGateway } from '../../../interfaces/gateways/RouterGateway';
import { ThunkResult } from '../../../store/createAction';
import { setAppReady, setGame, setPlayer } from '../../actions';

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

export const fetchMe = (): ThunkResult<Promise<void>> => {
  return async (dispatch, _getState, { playerGateway, gameGateway, routerGateway }) => {
    const player = await playerGateway.fetchMe();

    if (player) {
      dispatch(setPlayer(player));
    }

    if (player?.gameId) {
      const game = await gameGateway.fetchGame(player.gameId);

      dispatch(setGame(game));
    }

    redirect(routerGateway, player);
    dispatch(setAppReady());
  };
};

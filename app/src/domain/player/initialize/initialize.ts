import { Game } from '../../../interfaces/entities/Game';
import { Player } from '../../../interfaces/entities/Player';
import { RouterGateway } from '../../../interfaces/gateways/RouterGateway';
import { createThunk } from '../../../store/createThunk';
import { setAppReady, setGame, setPlayer } from '../../actions';
import { connect } from '../connect/connect';

const redirect = (router: RouterGateway, player?: Player, game?: Game) => {
  if (!player) {
    return router.push('/login');
  }

  if (game) {
    return router.push('/game/' + game.code);
  }

  return router.push('/');
};

export const initialize = createThunk(async ({ dispatch, playerGateway, gameGateway, routerGateway }) => {
  const player = await playerGateway.fetchMe();
  let game: Game | undefined;

  if (player) {
    dispatch(setPlayer(player));
    await dispatch(connect());
  }

  if (player?.gameId) {
    game = await gameGateway.fetchGame(player.gameId);
    dispatch(setGame(game));
  }

  redirect(routerGateway, player, game);
  dispatch(setAppReady());
});

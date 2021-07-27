import { createThunk } from '../../../../store/createThunk';
import { setAppReady, setGame, setPlayer } from '../../../actions';
import { Game } from '../../../entities/Game';
import { redirect } from '../../game/redirect/redirect';
import { connect } from '../connect/connect';

export const initialize = createThunk(async ({ dispatch, playerGateway, gameGateway }) => {
  const player = await playerGateway.fetchMe();
  let game: Game | undefined;

  if (player) {
    dispatch(setPlayer(player));
    await dispatch(connect());
  }

  if (player?.gameId) {
    game = await gameGateway.fetchGame(player.gameId);

    if (game) {
      dispatch(setGame(game));
    }
  }

  dispatch(redirect());
  dispatch(setAppReady());
});

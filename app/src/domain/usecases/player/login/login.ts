import { createThunk } from '../../../../store/createThunk';
import { setGame, setPlayer } from '../../../actions';
import { redirect } from '../../game/redirect/redirect';
import { connect } from '../connect/connect';

export const login = createThunk(async ({ dispatch, gameGateway, playerGateway }, nick: string) => {
  const player = await playerGateway.login(nick);

  dispatch(setPlayer(player));
  await dispatch(connect());

  if (player.gameId) {
    const game = await gameGateway.fetchGame(player.gameId);

    if (game) {
      dispatch(setGame(game));
    }
  }

  dispatch(redirect());
});

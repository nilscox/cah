import { createThunk } from '../../../../store/createThunk';
import { setAppReady, setGame, setPlayer, setTurns } from '../../../actions';
import { redirect } from '../../game/redirect/redirect';
import { connect } from '../connect/connect';

const fetchPlayer = createThunk(async ({ dispatch, playerGateway }) => {
  const player = await playerGateway.fetchMe();

  if (player) {
    dispatch(setPlayer(player));
    await dispatch(connect());
  }

  return player;
});

const fetchGame = createThunk(async ({ dispatch, gameGateway }, gameId: string) => {
  const game = await gameGateway.fetchGame(gameId);

  if (game) {
    dispatch(setGame(game));
    dispatch(setTurns(await gameGateway.fetchTurns(game.id)));
  }
});

export const initialize = createThunk(async ({ dispatch }) => {
  const player = await dispatch(fetchPlayer());

  if (player?.gameId) {
    await dispatch(fetchGame(player.gameId));
  }

  dispatch(redirect());
  dispatch(setAppReady());
});

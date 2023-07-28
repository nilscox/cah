import { gameActions } from '../../slices/game.slice';
import { playerActions } from '../../slices/player.slice';
import { createThunk } from '../../store/create-thunk';

export const authenticate = createThunk('authenticate', async ({ dispatch, client }, nick: string) => {
  await client.authenticate(nick);

  const player = await client.getAuthenticatedPlayer();

  dispatch(playerActions.setPlayer(player));
  client.connect();

  if (player.gameId) {
    const game = await client.getGame(player.gameId);
    dispatch(gameActions.setGame(game));
  }
});

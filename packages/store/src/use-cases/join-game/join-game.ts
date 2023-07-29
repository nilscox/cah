import { gameActions } from '../../slices/game/game.slice';
import { createThunk } from '../../store/create-thunk';

export const joinGame = createThunk('join-game', async ({ dispatch, client }, code: string) => {
  const gameId = await client.joinGame(code);
  const game = await client.getGame(gameId);

  dispatch(gameActions.setGame(game));
});

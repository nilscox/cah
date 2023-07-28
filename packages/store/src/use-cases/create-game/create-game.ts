import { gameActions } from '../../slices/game.slice';
import { createThunk } from '../../store/create-thunk';

export const createGame = createThunk('create-game', async ({ dispatch, client }) => {
  const gameId = await client.createGame();
  const game = await client.getGame(gameId);

  dispatch(gameActions.setGame(game));
});

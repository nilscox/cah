import { gameActions } from '../../slices/game/game.slice';
import { createThunk } from '../../store/create-thunk';

export const leaveGame = createThunk('leave-game', async ({ client, dispatch }) => {
  await client.leaveGame();
  client.disconnect();

  dispatch(gameActions.unsetGame());
});

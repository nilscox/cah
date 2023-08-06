import { gameActions } from '../../slices/game/game.slice';
import { createThunk2 } from '../../store/create-thunk';

export const leaveGame = createThunk2(async ({ client, dispatch }) => {
  await client.leaveGame();
  client.disconnect();

  dispatch(gameActions.unsetGame());
});

import { createAction } from '@reduxjs/toolkit';

import { createThunk2 } from '../../store/create-thunk';

export const leaveGame = createThunk2(async ({ client, dispatch }) => {
  await client.leaveGame();
  client.disconnect();

  dispatch(gameLeft());
});

export const gameLeft = createAction('game-left');

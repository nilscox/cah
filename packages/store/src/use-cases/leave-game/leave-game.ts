import { createAction } from '@reduxjs/toolkit';

import { createThunk } from '../../store/create-thunk';

export const leaveGame = createThunk(async ({ client, dispatch }) => {
  await client.leaveGame();
  client.disconnect();

  dispatch(gameLeft());
});

export const gameLeft = createAction('game-left');

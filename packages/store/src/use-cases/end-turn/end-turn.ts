import { createThunk } from '../../store/create-thunk.ts';

export const endTurn = createThunk(async ({ client }) => {
  await client.endTurn();
});

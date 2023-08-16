import { createThunk } from '../../store/create-thunk';

export const endTurn = createThunk(async ({ client }) => {
  await client.endTurn();
});

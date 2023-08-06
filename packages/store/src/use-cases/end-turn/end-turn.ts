import { createThunk2 } from '../../store/create-thunk';

export const endTurn = createThunk2(async ({ client }) => {
  await client.endTurn();
});

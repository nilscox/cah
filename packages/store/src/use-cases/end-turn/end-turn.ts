import { createThunk } from '../../store/create-thunk';

export const endTurn = createThunk('end-turn', async ({ client }) => {
  await client.endTurn();
});

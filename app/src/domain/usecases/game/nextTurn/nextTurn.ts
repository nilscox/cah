import { createThunk } from '../../../../store/createThunk';

export const nextTurn = createThunk(async ({ gameGateway }) => {
  await gameGateway.endCurrentTurn();
});

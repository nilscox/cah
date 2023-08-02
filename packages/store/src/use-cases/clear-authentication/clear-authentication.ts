import { createThunk } from '../../store/create-thunk';

export const clearAuthentication = createThunk('clear-authentication', async ({ client }) => {
  await client.clearAuthentication();
});

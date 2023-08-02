import { createThunk } from '../../store/create-thunk';
import { initialize } from '../initialize/initialize';

export const authenticate = createThunk('authenticate', async ({ dispatch, client }, nick: string) => {
  await client.authenticate(nick);
  await dispatch(initialize());
});

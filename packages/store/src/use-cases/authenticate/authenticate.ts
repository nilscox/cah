import { createThunk } from '../../store/create-thunk.ts';
import { initialize } from '../initialize/initialize.ts';

export const authenticate = createThunk(async ({ dispatch, client }, nick: string) => {
  await client.authenticate(nick);
  await dispatch(initialize());
});

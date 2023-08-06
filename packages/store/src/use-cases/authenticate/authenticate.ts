import { createThunk2 } from '../../store/create-thunk';
import { initialize } from '../initialize/initialize';

export const authenticate = createThunk2(async ({ dispatch, client }, nick: string) => {
  await client.authenticate(nick);
  await dispatch(initialize());
});

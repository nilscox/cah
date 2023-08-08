import { createAction } from '@reduxjs/toolkit';

import { createThunk2 } from '../../store/create-thunk';

export const clearAuthentication = createThunk2(async ({ dispatch, client }) => {
  await client.clearAuthentication();
  dispatch(unauthenticated());
});

export const unauthenticated = createAction('unauthenticated');

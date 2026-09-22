import { createAction } from '@reduxjs/toolkit';

import { createThunk } from '../../store/create-thunk.ts';

export const clearAuthentication = createThunk(async ({ dispatch, client }) => {
  await client.clearAuthentication();
  dispatch(unauthenticated());
});

export const unauthenticated = createAction('unauthenticated');

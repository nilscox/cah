import { createSlice, PayloadAction } from '@reduxjs/toolkit';

import { AppState, NetworkStatus } from '../../../domain/entities/AppState';

const initialState: AppState = {
  network: NetworkStatus.up,
  server: NetworkStatus.up,
  ready: false,
};

export const appSlice = createSlice({
  name: 'app',
  initialState,
  reducers: {
    setNetworkStatus(app, { payload }: PayloadAction<{ status: NetworkStatus }>) {
      app.network = payload.status;
    },
    setServerStatus(app, { payload }: PayloadAction<{ status: NetworkStatus }>) {
      app.server = payload.status;
    },
    setAppReady(app, { payload }: PayloadAction<{ ready: boolean }>) {
      app.ready = payload.ready;
    },
    setNotification(app, { payload }: PayloadAction<{ notification: string } | undefined>) {
      app.notification = payload?.notification;
    },
  },
});

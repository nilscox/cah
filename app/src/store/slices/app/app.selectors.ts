import { createSelector } from '@reduxjs/toolkit';

import { AppState } from '../../types';

export const selectApp = (state: AppState) => {
  return state.app;
};

export const selectNetworkStatus = createSelector(selectApp, (app) => {
  return app.network;
});

export const selectServerStatus = createSelector(selectApp, (app) => {
  return app.server;
});

export const selectNotification = createSelector(selectApp, (app) => {
  return app.notification;
});

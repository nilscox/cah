import { AppState } from '../types';

export const selectNotification = (state: AppState) => state.app.notification;

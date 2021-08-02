import { AppState } from '../types';

export const selectMenuOpen = (state: AppState) => state.app.menuOpen;
export const selectNotification = (state: AppState) => state.app.notification;

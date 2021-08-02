import { AppAction } from '../types';

export enum ServerStatus {
  up = 'up',
  down = 'down',
}

export type AppState = {
  server: ServerStatus;
  ready: boolean;
  menuOpen: boolean;
  notification?: string;
};

const defaultAppState: AppState = {
  server: ServerStatus.up,
  ready: false,
  menuOpen: false,
};

export const appStateReducer = (state = defaultAppState, action: AppAction): AppState => {
  if (action.type === 'server/status') {
    return { ...state, server: action.payload };
  }

  if (action.type === 'app/ready') {
    return { ...state, ready: true };
  }

  if (action.type === 'app/open-menu') {
    return { ...state, menuOpen: true };
  }

  if (action.type === 'app/close-menu') {
    return { ...state, menuOpen: false };
  }

  if (action.type === 'app/set-notification') {
    return { ...state, notification: action.payload };
  }

  if (action.type === 'app/clear-notification') {
    return { ...state, notification: undefined };
  }

  return state;
};

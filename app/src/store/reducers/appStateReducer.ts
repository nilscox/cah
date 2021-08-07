import { AppAction } from '../types';

export enum NetworkStatus {
  up = 'up',
  down = 'down',
}

export type AppState = {
  network: NetworkStatus;
  server: NetworkStatus;
  ready: boolean;
  notification?: string;
};

const defaultAppState: AppState = {
  network: NetworkStatus.up,
  server: NetworkStatus.up,
  ready: false,
};

export const appStateReducer = (state = defaultAppState, action: AppAction): AppState => {
  if (action.type === 'network/status') {
    return { ...state, network: action.payload };
  }

  if (action.type === 'server/status') {
    return { ...state, server: action.payload };
  }

  if (action.type === 'app/ready') {
    return { ...state, ready: true };
  }

  if (action.type === 'app/set-notification') {
    return { ...state, notification: action.payload };
  }

  if (action.type === 'app/clear-notification') {
    return { ...state, notification: undefined };
  }

  return state;
};

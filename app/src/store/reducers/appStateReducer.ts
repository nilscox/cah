import { AppAction } from '../types';

export type AppState = {
  ready: boolean;
};

const defaultAppState: AppState = {
  ready: false,
};

export const appStateReducer = (state = defaultAppState, action: AppAction): AppState => {
  if (action.type === 'app/ready') {
    return { ready: true };
  }

  return state;
};

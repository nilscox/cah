import { AppState } from '../../types';

const player = (state: AppState) => state.player;

export const playerSelectors = {
  player,
};

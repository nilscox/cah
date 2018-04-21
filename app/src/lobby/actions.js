import { game } from '../api';

export const GAME_LIST = 'GAME_LIST';
export const listGames = () => ({
  type: GAME_LIST,
  promise: game.list(),
});
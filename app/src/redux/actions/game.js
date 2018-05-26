// @flow

export const GAMES_LIST = 'GAMES_LIST';
export const listGames = () => ({
  type: GAMES_LIST,
  route: `/api/game/list`,
});

export const GAME_FETCH = 'GAME_FETCH';
export const fetchGame = () => ({
  type: GAME_FETCH,
  route: `/api/game`,
});

export const GAME_FETCH_HISTORY = 'GAME_FETCH_HISTORY';
export const fetchGameHistory = () => ({
  type: GAME_FETCH_HISTORY,
  route: `/api/game/history`,
});

export const GAME_CREATE = 'GAME_CREATE';
export const createGame = () => ({
  type: GAME_CREATE,
  route: `/api/game`,
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ lang: 'fr' }),
});

export const GAME_START = 'GAME_START';
export const startGame = () => ({
  type: GAME_START,
  route: `/api/game/start`,
  method: 'POST',
});

export const GAME_JOIN = 'GAME_JOIN';
export const joinGame = (id: number) => ({
  type: GAME_JOIN,
  route: `/api/game/join/${id}`,
  method: 'POST',
});

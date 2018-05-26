// @flow

export const PLAYER_FETCH = 'PLAYER_FETCH';
export const fetchPlayer = () => ({
  type: PLAYER_FETCH,
  route: '/api/player',
});

export const PLAYER_LOGIN = 'PLAYER_LOGIN';
export const loginPlayer = (nick: string) => ({
  type: PLAYER_LOGIN,
  route: '/api/player',
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ nick }),
});

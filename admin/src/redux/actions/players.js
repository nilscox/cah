export const PLAYERS_LIST = 'PLAYERS_LIST';
export const listPlayers = () => ({
  type: PLAYERS_LIST,
  route: '/api/player',
});

export const PLAYER_CREATE = 'PLAYER_CREATE';
export const createPlayer = (nick) => ({
  type: PLAYER_CREATE,
  route: '/api/player',
  method: 'POST',
  body: {
    nick: nick,
  },
});

export const PLAYER_UPDATE = 'PLAYER_UPDATE';
export const updatePlayer = (player, nick) => ({
  type: PLAYER_UPDATE,
  route: `/api/player/${player.id}`,
  method: 'PATCH',
  body: {
    nick,
  },
});

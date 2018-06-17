export const PLAYERS_LIST = 'PLAYERS_LIST';
export const listPlayers = () => ({
  type: PLAYERS_LIST,
  route: `/api/admin/player/`,
});

export const GAMES_LIST = 'GAMES_LIST';
export const listGames = () => ({
  type: GAMES_LIST,
  route: `/api/admin/game/`,
});

export const GAME_FETCH_HISTORY = 'GAMES_FETCH_HISTORIES';
export const fetchGameHistory = (game) => ({
  type: GAME_FETCH_HISTORY,
  route: `/api/admin/game/${game.id}/history/`,
});

export const GAMES_FETCH_HISTORIES = 'GAMES_FETCH_HISTORIES';
export const fetchGamesHistories = (games) => (dispatch) => {
  return Promise.all(games.map(game => dispatch(fetchGameHistory(game))));
};

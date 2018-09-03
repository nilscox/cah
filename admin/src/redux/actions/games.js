export const GAMES_LIST = 'GAMES_LIST';
export const listGames = () => ({
  type: GAMES_LIST,
  route: '/api/game',
});

export const GAMES_FETCH_HISTORIES = 'GAMES_FETCH_HISTORIES';
export const fetchGamesHistories = (games) => (dispatch) => {
  return Promise.all(games.map(game => dispatch(fetchGameHistory(game))));
};

export const GAME_FETCH_HISTORY = 'GAME_FETCH_HISTORY';
export const fetchGameHistory = (game) => ({
  type: GAME_FETCH_HISTORY,
  route: `/api/game/${game.id}/history`,
  meta: {
    gameId: game.id,
  },
});

export const GAME_CREATE = 'GAME_CREATE';
export const createGame = (owner, lang, nbQuestions, cardsPerPlayer) => ({
  type: GAME_CREATE,
  route: '/api/game',
  method: 'POST',
  body: {
    playerId: owner.id,
    lang,
    nbQuestions,
    cardsPerPlayer,
  },
});

import selectors from '~/redux/selectors'

export const TOGGLE_CHOICE = 'TOGGLE_CHOICE';
export const toggleChoice = (choice) => ({
  type: TOGGLE_CHOICE,
  choice,
});

const onGameFetched = ({ dispatch, getState }) => {
  const game = selectors.currentGame(getState());

  if (!game || game.state === 'idle')
    return;

  return dispatch(fetchGameHistory(game.id));
};

export const GAMES_LIST = 'GAMES_LIST';
export const listGames = () => ({
  type: GAMES_LIST,
  route: `/api/game`,
});

export const GAME_FETCH = 'GAME_FETCH';
export const fetchGame = (id) => ({
  type: GAME_FETCH,
  route: `/api/game/${id}`,
  after: onGameFetched,
});

export const GAME_FETCH_HISTORY = 'GAME_FETCH_HISTORY';
export const fetchGameHistory = (id) => ({
  type: GAME_FETCH_HISTORY,
  route: `/api/game/${id}/history`,
});

export const GAME_JOIN = 'GAME_JOIN';
export const joinGame = (id) => ({
  type: GAME_JOIN,
  route: `/api/game/${id}/join`,
  method: 'POST',
});

export const GAME_LEAVE = 'GAME_LEAVE';
export const leaveGame = (id) => ({
  type: GAME_LEAVE,
  route: `/api/game/${id}/leave`,
  method: 'POST',
});

export const GAME_CREATE = 'GAME_CREATE';
export const createGame = () => ({
  type: GAME_CREATE,
  route: `/api/game`,
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ lang: 'fr', nbQuestions: 2, cardsPerPlayer: 4 }),
});

export const GAME_START = 'GAME_START';
export const startGame = () => (dispatch, getState) => {
  const game = selectors.currentGame(getState());

  return dispatch({
    type: GAME_START,
    route: `/api/game/${game.id}/start`,
    method: 'POST',
  });
};

export const SUBMIT_ANSWER = 'SUBMIT_ANSWER';
export const submitAnswer = (choices) => (dispatch, getState) => {
  const game = selectors.currentGame(getState());

  return dispatch({
    type: SUBMIT_ANSWER,
    route: `/api/game/${game.id}/answer`,
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ ids: choices.map(c => c.id) }),
  });
};

export const SELECT_ANSWER = 'SELECT_ANSWER';
export const selectAnswer = (answer) => (dispatch, getState) => {
  const game = selectors.currentGame(getState());

  return dispatch({
    type: SELECT_ANSWER,
    route: `/api/game/${game.id}/select`,
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ id: answer.id }),
  });
};

export const GAME_NEXT_TURN = 'GAME_NEXT_TURN';
export const nextTurn = () => (dispatch, getState) => {
  const game = selectors.currentGame(getState());

  return dispatch({
    type: GAME_NEXT_TURN,
    route: `/api/game/${game.id}/next`,
    method: 'POST',
  });
};

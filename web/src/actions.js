import request from './request';

function asyncRequest(prefix, opts) {
  let { method, route, body, expected, dispatchRequest, dispatchSuccess, dispatchFailure } = opts;

  if (!dispatchRequest)
    dispatchRequest = dispatch => dispatch({ type: prefix + '_REQUEST' });

  if (!dispatchSuccess)
    dispatchSuccess = (dispatch, status, body) => dispatch({ type: prefix + '_SUCCESS', status, body });

  if (!dispatchFailure)
    dispatchFailure = (dispatch, error) => dispatch({ type: prefix + '_FAILURE', error });

  return function(dispatch) {
    dispatchRequest(dispatch);
    return request(method, route, body, expected)
      .then(
        ({ status, body }) => dispatchSuccess(dispatch, status, body),
        error => dispatchFailure(dispatch, error)
      );
  };
}

export const INITIALIZED = 'INITIALIZED';
export function initializationFinished() {
  return {
    type: INITIALIZED,
  };
}

export const CLEAR_ERROR = 'CLEAR_ERROR';
export function clearError() {
  return {
    type: CLEAR_ERROR,
  };
}

const PLAYER_ROUTE = '/api/player';
const GAME_ROUTE = '/api/game';
const ANSWER_ROUTE = '/api/answer';

export const PLAYER_LOGIN = 'PLAYER_LOGIN';
export function loginPlayer(nick) {
  return asyncRequest(PLAYER_LOGIN, {
    method: 'POST',
    route: PLAYER_ROUTE,
    body: { nick },
    expected: [200, 201],
  });
}

export const PLAYER_LOGOUT = 'PLAYER_LOGOUT';
export function logoutPlayer() {
  return asyncRequest(PLAYER_LOGOUT, {
    method: 'DELETE',
    route: PLAYER_ROUTE,
  });
}

export const PLAYER_FETCH = 'PLAYER_FETCH';
export function fetchPlayer() {
  return asyncRequest(PLAYER_FETCH, {
    method: 'GET',
    route: PLAYER_ROUTE,
    expected: [200, 404],
  });
}

export const GAME_FETCH = 'GAME_FETCH';
export function fetchGame() {
  return asyncRequest(GAME_FETCH, {
    method: 'GET',
    route: GAME_ROUTE,
    expected: [200, 404],
  });
}

export const GAME_CREATE = 'GAME_CREATE';
export function createGame() {
  return asyncRequest(GAME_CREATE, {
    method: 'POST',
    route: GAME_ROUTE,
    expected: 201,
  });
}

export const GAME_JOIN = 'GAME_JOIN';
export function joinGame(id) {
  return asyncRequest(GAME_JOIN, {
    method: 'POST',
    route: [GAME_ROUTE, 'join', id].join('/'),
  });
}

export const GAME_LEAVE = 'GAME_LEAVE';
export function leaveGame() {
  return asyncRequest(GAME_LEAVE, {
    method: 'POST',
    route: GAME_ROUTE + '/leave',
  });
}

export const GAME_START = 'GAME_START';
export function startGame() {
  return asyncRequest(GAME_START, {
    method: 'POST',
    route: GAME_ROUTE + '/start',
  });
}

export const GAME_TOGGLE_CHOICE = 'GAME_TOGGLE_CHOICE';
export function toggleChoice(choice) {
  return {
    type: GAME_TOGGLE_CHOICE,
    choice,
  };
}

export const GAME_SUBMIT_ANSWER = 'GAME_SUBMIT_ANSWER';
export function submitAnswer(choiceIds) {
  return asyncRequest(GAME_SUBMIT_ANSWER, {
    method: 'POST',
    route: ANSWER_ROUTE,
    body: {
      id: choiceIds.length <= 1 ? choiceIds : undefined,
      ids: choiceIds.length > 1 ? choiceIds : undefined,
    }
  });
}

export const GAME_SELECT_ANSWER = 'GAME_SELECT_ANSWER';
export function selectAnswer(answerId) {
  return asyncRequest(GAME_SELECT_ANSWER, {
    method: 'POST',
    route: ANSWER_ROUTE + '/select/' + answerId,
  });
}

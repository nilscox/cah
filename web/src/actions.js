import request from './request';
import {
  connect as connectWS,
  send as sendToWS,
  close as closeWS,
} from './websocket';

export const API_STATE = {
  UP: 'UP',
  DOWN: 'DOWN',
};

export const WS_STATE = {
  CLOSED: 'CLOSED',
  CREATED: 'CREATED',
  CONNECTED: 'CONNECTED',
};

function asyncRequest(prefix, opts) {
  let { method, route, body, expected } = opts;

  return function(dispatch, getState) {
    dispatch({ type: prefix + '_REQUEST' });

    return request(method, route, body, expected)
      .then(
        ({ status, body }) => {
          dispatch({type: prefix + '_SUCCESS', status, body});
          dispatch(apiUp());

          return { status, body };
        },
        error => {
          dispatch({ type: prefix + '_FAILURE', error });

          // TODO: clean up
          if (error.message === 'Failed to fetch')
            dispatch(apiDown());

          return { status: null, error };
        }
      )
      .then(result => ({ dispatch, getState, result }));
  };
}

export const CHECK_API_STATUS = 'CHECK_API_STATUS';
export function checkApiStatus() {
  return (dispatch, getState) => {
    const onSuccess = () => {
      const { status } = getState();

      if (status.api === API_STATE.DOWN) {
        dispatch(apiUp());
        dispatch(initializationStart());
      }
    };

    const onFailure = () => dispatch(apiDown());

    dispatch({ type: CHECK_API_STATUS });

    return request('GET', '/api/')
      .then(onSuccess, onFailure);
  };
}

export const API_DOWN = 'API_DOWN';
export function apiDown() {
  return (dispatch, getState) => {
    const { status } = getState();

    if (status.websocket === WS_STATE.CONNECTED)
      closeWS();

    if (status.api === API_STATE.UP)
      dispatch({ type: API_DOWN });

    setTimeout(() => dispatch(checkApiStatus()), 5000);
  };
}

export const API_UP = 'API_UP';
export function apiUp() {
  return (dispatch, getState) => {
    const { status, player } = getState();

    if (status.api === API_STATE.DOWN)
      dispatch({ type: API_UP });

    if (status.websocket === WS_STATE.CLOSED && player && player.nick)
      connectWS(dispatch);
  };
}

export function initializationStart() {
  return (dispatch, getState) => {
    dispatch(fetchPlayer())
      .then(() => {
        const { player } = getState();

        if (player && player.nick)
          return dispatch(fetchGame());
      })
      .then(() => dispatch(initializationFinished()));
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
  return (dispatch, getState) => {
    return dispatch(asyncRequest(PLAYER_LOGIN, {
      method: 'POST',
      route: PLAYER_ROUTE,
      body: { nick },
      expected: [200, 201],
    }))
      .then(({ dispatch, getState }) => {
        const { player } = getState();

        if (player && player.nick)
          return dispatch(fetchGame());
      });
  };
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
  return (dispatch, getState) => {
    return dispatch(asyncRequest(PLAYER_FETCH, {
      method: 'GET',
      route: PLAYER_ROUTE,
      expected: [200, 404],
    }));
  };
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

export const WEBSOCKET_CREATED = 'WEBSOCKET_CREATED';
export function websocketCreated() {
  return {
    type: WEBSOCKET_CREATED,
  };
}

export const WEBSOCKET_CONNECTED = 'WEBSOCKET_CONNECTED';
export function websocketConnected(event) {
  return (dispatch, getState) => {
    const { player }= getState();

    sendToWS({
      action: 'connected',
      nick: player.nick,
    });

    dispatch({
      type: WEBSOCKET_CONNECTED,
      event,
    });
  };
}

export const WEBSOCKET_MESSAGE_PREFIX = 'WS_';
export function websocketMessage(event, message) {
  if (!message.type)
    throw new Error('No action in message: ' + message);

  return dispatch => {
    dispatch({
      type: WEBSOCKET_MESSAGE_PREFIX + message.type,
      message,
    });
  };
}

export const WEBSOCKET_CLOSED = 'WEBSOCKET_CLOSED';
export function websocketClosed() {
  return dispatch => {
    dispatch({
      type: WEBSOCKET_CLOSED,
    });

    dispatch(checkApiStatus());
  };
}

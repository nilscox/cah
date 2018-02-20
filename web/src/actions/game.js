import { GAME_ROUTE, ANSWER_ROUTE} from '../constants';
import request from './requestAction';

export const GAME_FETCH = 'GAME_FETCH';
export function fetchGame() {
  return request(GAME_FETCH, {
    method: 'GET',
    route: GAME_ROUTE,
    expected: [200, 404],
  });
}

export const GAME_FETCH_HISTORY = 'GAME_FETCH_HISTORY';
export function fetchGameHistory() {
  return request(GAME_FETCH_HISTORY, {
    method: 'GET',
    route: GAME_ROUTE + '/history',
    expected: 200,
  });
}

export const GAME_CREATE = 'GAME_CREATE';
export function createGame() {
  return request(GAME_CREATE, {
    method: 'POST',
    route: GAME_ROUTE,
    expected: 201,
  });
}

export const GAME_JOIN = 'GAME_JOIN';
export function joinGame(id) {
  return request(GAME_JOIN, {
    method: 'POST',
    route: [GAME_ROUTE, 'join', id].join('/'),
  });
}

export const GAME_LEAVE = 'GAME_LEAVE';
export function leaveGame() {
  return request(GAME_LEAVE, {
    method: 'POST',
    route: GAME_ROUTE + '/leave',
  });
}

export const GAME_START = 'GAME_START';
export function startGame() {
  return request(GAME_START, {
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
  return request(GAME_SUBMIT_ANSWER, {
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
  return request(GAME_SELECT_ANSWER, {
    method: 'POST',
    route: ANSWER_ROUTE + '/select/' + answerId,
  });
}

export const NEXT_TURN = 'NEXT_TURN';
export function nextTurn() {
  return request(NEXT_TURN, {
    method: 'POST',
    route: GAME_ROUTE + '/next',
  });
}

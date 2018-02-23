// @flow

import type { RequestAction } from '../types/actions';
import type { GameToggleChoiceAction } from '../types/actions';
import type { ChoiceType } from '../types/models';
import { GAME_ROUTE, ANSWER_ROUTE} from '../constants';
import request from './requestAction';

export const GAME_FETCH = 'GAME_FETCH';
export function fetchGame(): RequestAction {
  return request(GAME_FETCH, {
    method: 'GET',
    route: GAME_ROUTE,
    expected: [200, 404],
  });
}

export const GAME_FETCH_HISTORY = 'GAME_FETCH_HISTORY';
export function fetchGameHistory(): RequestAction {
  return request(GAME_FETCH_HISTORY, {
    method: 'GET',
    route: GAME_ROUTE + '/history',
    expected: 200,
  });
}

export const GAME_CREATE = 'GAME_CREATE';
export function createGame(): RequestAction {
  return request(GAME_CREATE, {
    method: 'POST',
    route: GAME_ROUTE,
    expected: 201,
  });
}

export const GAME_JOIN = 'GAME_JOIN';
export function joinGame(id: number): RequestAction {
  return request(GAME_JOIN, {
    method: 'POST',
    route: [GAME_ROUTE, 'join', id].join('/'),
  });
}

export const GAME_LEAVE = 'GAME_LEAVE';
export function leaveGame(): RequestAction {
  return request(GAME_LEAVE, {
    method: 'POST',
    route: GAME_ROUTE + '/leave',
  });
}

export const GAME_START = 'GAME_START';
export function startGame(): RequestAction {
  return request(GAME_START, {
    method: 'POST',
    route: GAME_ROUTE + '/start',
  });
}

export const GAME_TOGGLE_CHOICE = 'GAME_TOGGLE_CHOICE';
export function toggleChoice(choice: ChoiceType): GameToggleChoiceAction {
  return {
    type: GAME_TOGGLE_CHOICE,
    choice,
  };
}

export const GAME_SUBMIT_ANSWER = 'GAME_SUBMIT_ANSWER';
export function submitAnswer(choiceIds: Array<number>): RequestAction {
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
export function selectAnswer(answerId: number): RequestAction {
  return request(GAME_SELECT_ANSWER, {
    method: 'POST',
    route: ANSWER_ROUTE + '/select/' + answerId,
  });
}

export const NEXT_TURN = 'NEXT_TURN';
export function nextTurn(): RequestAction {
  return request(NEXT_TURN, {
    method: 'POST',
    route: GAME_ROUTE + '/next',
  });
}

// @flow

import type {
  InitializationFinishedAction,
  InitializationStartedAction,
  ThunkAction,
} from 'Types/actions';
import { fetchPlayer } from './player';
import { fetchGame, fetchGameHistory } from './game';
import { loadSettings } from './settings';

export const INITIALIZATION_STARTED = 'INITIALIZATION_STARTED';
export function initializationStarted(): InitializationStartedAction {
  return {
    type: INITIALIZATION_STARTED,
  };
};

export const INITIALIZATION_FINISHED = 'INITIALIZATION_FINISHED';
export function initializationFinished(): InitializationFinishedAction {
  return {
    type: INITIALIZATION_FINISHED,
  };
}

export const INITIALIZE = 'INITIALIZE';
export function initialize(): ThunkAction {
  return (dispatch, getState) => {
    dispatch(initializationStarted());
    dispatch(loadSettings());
    dispatch(fetchPlayer())
      .then(() => {
        const { player } = getState();

        if (player)
          return dispatch(fetchGame());
      })
      .then(() => {
        const { game } = getState();

        if (game && game.state !== 'idle')
          return dispatch(fetchGameHistory());
      })
      .then(() => dispatch(initializationFinished()));
  };
}

import { fetchPlayer } from './player';
import { fetchGame, fetchGameHistory } from './game';
import { loadSettings } from './settings';

export const INITIALIZATION_STARTED = 'INITIALIZATION_STARTED';
export function initializationStart() {
  return dispatch => {
    dispatch({ type: INITIALIZATION_STARTED });

    dispatch(loadSettings());

    dispatch(fetchPlayer())
      .then(result => {
        if (result && result.status === 200)
          return dispatch(fetchGame());
      })
      .then(result => {
        if (result && result.status === 200 && result.body.state !== 'idle')
          return dispatch(fetchGameHistory());
      })
      .then(() => dispatch(initializationFinished()));
  };
}

export const INITIALIZATION_FINISHED = 'INITIALIZATION_FINISHED';
export function initializationFinished() {
  return {
    type: INITIALIZATION_FINISHED,
  };
}

import { fetchPlayer } from './player';
import { listGames } from './game';

export const INITIALIZATION_STARTED = 'INITIALIZATION_STARTED';
const initializationStarted = () => ({
  type: INITIALIZATION_STARTED,
});

export const INITIALIZATION_FINISHED = 'INITIALIZATION_FINISHED';
const initializationFinished = () => ({
  type: INITIALIZATION_FINISHED,
});

export const INITIALIZATION_ERROR = 'INITIALIZATION_ERROR';
const initializationError = (error) => ({
  type: INITIALIZATION_ERROR,
  error,
});

export const initialization = () => (dispatch, getState) => Promise.resolve()
  .then(() => dispatch(initializationStarted()))
  .then(() => dispatch(fetchPlayer()))
  .then(() => {
    const player = getState().player;

    if (player)
      return dispatch(listGames());
  })
  .catch((e) => dispatch(initializationError(e)))
  .then(() => dispatch(initializationFinished()));

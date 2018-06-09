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

export const initialization = () => (dispatch) => Promise.resolve()
  .then(() => dispatch(initializationStarted()))
  .then(() => dispatch(fetchPlayer()))
  .then(() => dispatch(listGames()))
  .catch(() => dispatch(initializationError()))
  .then(() => dispatch(initializationFinished()));

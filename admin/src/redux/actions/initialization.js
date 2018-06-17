import { listGames } from './games';

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

export const INITIALIZATION = 'INITIALIZATION';
export const initialization = () => (dispatch) => Promise.resolve()
  .then(() => dispatch(initializationStarted()))
  .then(() => dispatch(listGames()))
  .catch((err) => dispatch(initializationError(err)))
  .then(() => dispatch(initializationFinished()));

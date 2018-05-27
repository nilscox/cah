import { fetchPlayer } from './player';
import { listGames, fetchGame, fetchGameHistory } from './game';

export const INITIALIZATION_STARTED = 'INITIALIZATION_STARTED';
const initializationStarted = () => ({
  type: INITIALIZATION_STARTED,
});

export const INITIALIZATION_FINISHED = 'INITIALIZATION_FINISHED';
const initializationFinished = () => ({
  type: INITIALIZATION_FINISHED,
});

export const initialization = () => (dispatch, getState) => {
  Promise.resolve()
    .then(() => dispatch(initializationStarted()))
    .then(() => dispatch(fetchPlayer()))
    .then(() => {
      const { player } = getState();

      if (!player)
        throw null;
    })
    .then(() => dispatch(listGames()))
    .then(() => dispatch(fetchGame()))
    .then(() => {
      const { game } = getState();

      if (!game)
        throw null;

      return dispatch(fetchGameHistory());
    })
    .catch(e => {
      if (e !== null)
        throw e;
    })
    .then(() => dispatch(initializationFinished()))
    .catch(err => console.error('Initialization error', err));
};

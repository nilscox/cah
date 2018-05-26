// @flow

import { fetchPlayer } from './player';
import { fetchGame, fetchGameHistory } from './game';

const INITIALIZATION_STARTED = 'INITIALIZATION_STARTED';
const initializationStarted = () => ({
  type: INITIALIZATION_STARTED,
});

const INITIALIZATION_FINISHED = 'INITIALIZATION_FINISHED';
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

      return dispatch(fetchGame());
    })
    .then(() => {
      const { game } = getState();

      if (!game)
        throw null;

      return fetchGameHistory();
    })
    .catch(e => {
      if (e !== null)
        throw e;
    })
    .then(() => dispatch(initializationFinished()));
};

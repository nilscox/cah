import { fetchPlayer } from './player';
import { listGames, fetchGame, fetchGameHistory } from './game';
import { createWebSocket } from './websocket';

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

      return dispatch(createWebSocket());
    })
    .then((socket) => {
      // allow access to the socket in chrome console, for debugging prupuse
      global.socket = socket;

      const { player } = getState();

      socket.send(JSON.stringify({
        action: 'connected',
        nick: player.nick,
      }));
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
    .catch(err => {
      /* eslint-disable-next-line no-console */
      console.error('Initialization error', err);
    });
};

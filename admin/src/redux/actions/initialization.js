import { listGames, fetchGamesHistories } from './games';
import { listPlayers } from './players';
import { createWebsocket } from './websocket';

const API_ADMIN_TOKEN = process.env.REACT_APP_API_ADMIN_TOKEN;

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

export const LOGIN_ADMIN = 'LOGIN_ADMIN';
const loginAdmin = (token) => ({
  type: LOGIN_ADMIN,
  method: 'POST',
  route: '/api/admin',
  body: { token },
});

export const INITIALIZATION = 'INITIALIZATION';
export const initialization = () => (dispatch) => Promise.resolve()
  .then(() => dispatch(initializationStarted()))
  .then(() => dispatch(loginAdmin(API_ADMIN_TOKEN)))
  .then(() => dispatch(listGames()))
  .then(({ payload: games }) => dispatch(fetchGamesHistories(games)))
  .then(() => dispatch(listPlayers()))
  .then(() => dispatch(createWebsocket()))
  .catch((err) => dispatch(initializationError(err)))
  .then(() => dispatch(initializationFinished()));

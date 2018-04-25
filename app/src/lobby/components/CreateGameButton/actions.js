// @flow

import request from '../../../api/request';

export const CREATE_GAME = 'CREATE_GAME';
export const createGame = () => ({
  type: CREATE_GAME,
  promise: request('/api/game', {
    method: 'POST',
  }),
});

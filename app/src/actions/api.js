// @flow

import request from './request';
import type { RequestPromise } from './request';

export const player = {

  fetch: (): RequestPromise => {
    return request('/api/player');
  },

  login: (nick: string): RequestPromise => {
    const payload = { nick };

    return request('/api/player', {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    });
  },

};

export const game = {

  list: (): RequestPromise => {
    return request('/api/game/list');
  },

  fetch: (): RequestPromise => {
    return request('/api/game');
  },

  create: (): RequestPromise => {
    return request(`/api/game`, {
      method: 'POST',
    });
  },

  join: (id: number): RequestPromise => {
    return request(`/api/game/join/${id}`, {
      method: 'POST',
    });
  },

};


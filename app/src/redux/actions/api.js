// @flow

import request from './request';

export const player = {

  fetch: () => {
    return request('/api/player');
  },

  login: (nick: string) => {
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

  list: () => {
    return request('/api/game/list');
  },

  fetch: () => {
    return request('/api/game');
  },

  create: () => {
    return request(`/api/game`, {
      method: 'POST',
    });
  },

  join: (id: number) => {
    return request(`/api/game/join/${id}`, {
      method: 'POST',
    });
  },

};


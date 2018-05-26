// @flow

import request from './request';

export const player = {

  fetch() {
    return request('/api/player');
  },

  login(nick: string) {
    const payload = { nick };

    return request('/api/player', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    });
  },

};

export const game = {

  list() {
    return request('/api/game/list');
  },

  fetch() {
    return request('/api/game');
  },

  fetchHistory() {
    return request('/api/game/history');
  },

  create() {
    const payload = {
      lang: 'fr',
    };

    return request(`/api/game`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    });
  },

  start() {
    return request(`/api/game/start`, {
      method: 'POST',
    });
  },

  join(id: number) {
    return request(`/api/game/join/${id}`, {
      method: 'POST',
    });
  },

};


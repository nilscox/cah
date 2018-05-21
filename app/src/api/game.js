// @flow

import request from './request';
import type { RequestPromise } from './request';

export const list = (): RequestPromise => {
  return request('/api/game/list');
}

export const fetch = (): RequestPromise => {
  return request('/api/game');
}

export const join = (id: number): RequestPromise => {
  return request(`/api/game/join/${id}`, {
    method: 'POST',
  });
}

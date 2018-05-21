// @flow

import request from './request';
import type { RequestPromise } from './request';

export const fetch = (): RequestPromise => {
  return request('/api/player');
}

export const login = (nick: string): RequestPromise => {
  const payload = { nick };

  return request('/api/player', {
    method: 'POST',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload),
  });
}
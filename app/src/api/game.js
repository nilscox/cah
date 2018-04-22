// @flow

import request from './request';
import type { RequestPromise } from './request';

export const list = (): RequestPromise => {
  return request('/api/game/list');
}
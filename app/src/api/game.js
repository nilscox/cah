import request from './request';

export const list = () => {
  return request('/api/game/list');
}
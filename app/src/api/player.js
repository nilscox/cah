import request from './request';

export const login = (nick) => {
  const payload = { nick };

  return request('/api/player', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload),
  });
}
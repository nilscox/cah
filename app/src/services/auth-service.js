import request from './request-service';


export const createPlayer = (nick) => {
  return request('/api/player', {
    method: 'POST',
    body: { nick },
  });
};

export const login = (nick) => {
  return request('/api/player/login', {
    method: 'POST',
    body: { nick },
  });
};

export const logout = () => {
  return request('/api/player/logout', {
    method: 'POST',
  });
};

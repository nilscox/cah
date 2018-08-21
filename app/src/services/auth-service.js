import request from './request-service';


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

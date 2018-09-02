import request from './request-service';


export const fetchPlayer = (nick) => {
  return request(`/api/player/${nick}`);
};

export const fetchMe = () => {
  return request('/api/player/me');
};

export const updatePlayer = (nick, fields) => {
  return request(`/api/player/${nick}`, {
    method: 'PUT',
    body: fields,
  });
};

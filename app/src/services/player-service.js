import request from './request-service';


const API_URL = process.env.REACT_APP_API_URL;
const DEFAULT_AVATAR = require('../default-avatar.png');

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

export const playerAvatarUri = (player) => {
  return player.avatar
    ? { uri: API_URL + player.avatar }
    : DEFAULT_AVATAR;
};

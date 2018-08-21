import request from './request-service';


export const listGames = () => {
  return request(`/api/game`);
};

export const fetchGame = (id) => {
  return request(`/api/game/${id}`);
};

export const joinGame = (id) => {
  return request(`/api/game/${id}/join`, { method: 'POST' });
};

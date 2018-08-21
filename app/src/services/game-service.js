import request from './request-service';

export const listGames = () => {
  return request(`/api/game`);
};

import request from './request-service';


export const fetchMe = () => {
  return request('/api/player/me');
};

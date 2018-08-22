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

export const submitAnswer = (id, choices) => {
  return request(`/api/game/${id}/answer`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: { ids: choices.map(c => c.id) },
  });
};

export const selectAnswer = (id, answer) => {
  return request(`/api/game/${id}/select`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: { id: answer.id },
  });
};

export const nextTurn = (id) => {
  return request(`/api/game/${id}/next`, { method: 'POST' });
};

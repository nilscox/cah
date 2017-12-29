import request from './request';

export function create() {
  return request('POST', '/api/game/', null, 201)
    .then(res => res.body);
}

export function fetch() {
  return request('GET', '/api/game/')
    .then(res => res.body);
}

export function join(id) {
  return request('POST', '/api/game/join/' + id)
    .then(res => res.body);
}

export function start() {
  return request('POST', '/api/game/start/')
    .then(res => res.body);
}

export function answer(ids) {
  return request('POST', '/api/answer/', { ids })
    .then(res => res.body);
}

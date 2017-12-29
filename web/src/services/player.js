import request from './request';

export function fetch() {
  return request('GET', '/api/player/', null, [200, 404])
    .then(res => res.status === 200 ? res.body : null);
}

export function login(player) {
  return request('POST', '/api/player/', player, [200, 201])
    .then(res => res.body);
}

export function logout() {
  return request('DELETE', '/api/player/')
    .then(() => null);
}

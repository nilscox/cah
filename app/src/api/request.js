const API_URL = 'http://192.168.0.14:8000';

export default function request(route, opts) {
  let res = null;

  return fetch(API_URL + route, opts)
    .then(r => res = r)
    .then(() => {
      const contentType = res.headers.get('Content-Type');

      if (!contentType)
        return;

      if (contentType.match(/^application\/json/))
        return res.json();

      if (contentType.match(/^text\//))
        return res.text();
    })
    .then(body => ({ response: res, body }));
}

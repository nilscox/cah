// @flow

const API_URL = 'http://192.168.0.14:8000';

export type RequestPromise = Promise<{
  response: Response,
  body: any,
}>;

export default function request(route: string, opts?: {}): RequestPromise {
  return fetch(API_URL + route, opts)
    .then(res => {
      const contentType = res.headers.get('Content-Type');
      let promise = Promise.resolve();

      if (contentType) {
        if (contentType.match(/^application\/json/))
          promise = res.json();

        if (contentType.match(/^text\//))
          promise = res.text();
      }

      return promise
        .then((body: any) => ({ response: res, body }));
    });
}

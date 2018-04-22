// @flow

// $FlowFixMe
const API_URL: string = process.env.REACT_APP_API_URL;

export type RequestPromise = Promise<{
  response: Response,
  body: any,
}>;

export default function request(route: string, opts?: {}): RequestPromise {
  return fetch(API_URL + route, opts)
    .then(res => {
      const contentType = res.headers.get('Content-Type');

      if (!contentType)
        return;

      if (contentType.match(/^application\/json/))
        return res.json();

      if (contentType.match(/^text\//))
        return res.text();
    });
}

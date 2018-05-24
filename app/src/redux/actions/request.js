// @flow

// $FlowFixMe
const API_URL: string = process.env.REACT_APP_API_URL;

export default function request(route: string, opts?: {}) {
  return fetch(API_URL + route, opts)
    .then((res: Response) => {
      const contentType = res.headers.get('Content-Type');
      let promise = Promise.resolve();

      if (!contentType)
        return;

      if (contentType.match(/^application\/json/))
        promise = res.json();

      if (contentType.match(/^text\//))
        promise = res.text();

      return promise
        .then((result) => {
          if (!res.ok)
            throw result;

          return result;
        });
    });
}

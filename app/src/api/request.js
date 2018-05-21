// @flow

import fetch from 'isomorphic-fetch';

// $FlowFixMe
const API_URL: string = process.env.REACT_APP_API_URL;

export type RequestPromise = Promise<any>;

export default function request(route: string, opts?: {}): RequestPromise {

  console.log('[REQUEST] ' + route, opts);

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
          console.log('[REQUEST] ' + route, res, result);

          if (!res.ok)
            throw result;

          return result;
        });
    });
}

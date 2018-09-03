// import { checkApiStatus } from '../actions/status'

// eslint-disable-next-line no-undef
const API_URL = process.env.REACT_APP_API_URL;

const apiMiddleware = store => next => action => {
  if (action === null)
    return null;

  if (!action.route)
    return next(action);

  const { dispatch, getState } = store;
  const { type, route, after, meta, ...opts } = action;

  opts.credentials = 'include';

  if (!opts.headers)
    opts.headers = new Headers();

  if (typeof opts.body === 'object') {
    if (!opts.headers.has('Content-Type'))
      opts.headers.append('Content-Type', 'application/json');

    opts.body = JSON.stringify(opts.body);
  }

  const handleResponse = (res) => {
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
  };

  const handleError = (e) => {
    if (e instanceof Error && e.message === 'Network request failed')
      console.error('Network request failed'); // dispatch(checkApiStatus());

    throw e;
  };

  return next({
    type,
    promise: fetch(API_URL + route, opts)
      .then((res) => handleResponse(res))
      .catch(handleError),
    meta,
  })
    .then((result) => {
      if (after)
        return after({ result, dispatch, getState });

      return result;
    });
};

export default apiMiddleware;

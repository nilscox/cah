import { checkApiStatus } from '../actions/status'

// $FlowFixMe
const API_URL = process.env.REACT_APP_API_URL;

const apiMiddleware = store => next => action => {
  if (action === null)
    return null;

  if (!action.route)
    return next(action);

  const { dispatch } = store;
  const { type, route, meta, ...opts } = action;

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
      dispatch(checkApiStatus());

    throw e;
  };

  return store.dispatch({
    type,
    promise: fetch(API_URL + route, opts)
      .then(handleResponse)
      .catch(handleError),
    meta,
  });
};

export default apiMiddleware;

// $FlowFixMe
const API_URL = process.env.REACT_APP_API_URL;

export const API_UP = 'API_UP';
const apiUp = () => ({
  type: API_UP,
});

export const API_DOWN = 'API_DOWN';
const apiDown = () => ({
  type: API_DOWN,
});

export default apiMiddleware = store => next => action => {
  if (action === null)
    return null;

  if (!action.route)
    return next(action);

  const { type, route, ...opts } = action;

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

  return store.dispatch({
    type,
    promise: fetch(API_URL + route, opts).then(handleResponse),
    meta: {
      onSuccess: () => {
        const { status } = store.getState();

        if (status.api == 'down')
          store.dispatch(apiUp());
      },
      onFailure: () => {
        const { status } = store.getState();

        if (status.api == 'up')
          store.dispatch(apiDown());
      },
    },
  });
};

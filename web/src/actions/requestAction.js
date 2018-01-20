import doRequest from './request';
import { apiUp, apiDown } from './apiState';

export function requestThunk(prefix, opts, dispatch) {
  const { method, route, body, expected } = opts;

  dispatch({ type: prefix + '_REQUEST' });

  return doRequest(method, route, body, expected)
    .then(
      ({ status, body }) => {
        dispatch({type: prefix + '_SUCCESS', status, body});
        dispatch(apiUp());

        return { status, body };
      },
      error => {
        dispatch({ type: prefix + '_FAILURE', error });

        if (error.message === 'Failed to fetch')
          dispatch(apiDown());

        return { status: null, error };
      }
    );
}

export default function request(prefix, opts) {
  return requestThunk.bind(null, prefix, opts);
}

import request from '../request';
import { apiUp, apiDown } from './apiState';

export default function requestAction(prefix, opts) {
  const { method, route, body, expected } = opts;

  return dispatch => {
    dispatch({ type: prefix + '_REQUEST' });

    return request(method, route, body, expected)
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
  };
}

// @flow

import type { RequestAction } from '../types/actions';
import request from '../request';
import { apiUp, apiDown } from './apiState';

export type RequestActionOpts = {
  method: string,
  route: string,
  body?: any,
  expected?: number | Array<number>,
}

export default function requestAction(prefix: string, opts: RequestActionOpts): RequestAction {
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

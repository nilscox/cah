// @flow

import type {
  RequestFailureAction, RequestStartAction, RequestSuccessAction,
  ThunkAction
} from 'Types/actions';
import type { RequestResult } from '../request';
import request, { ApiRequestError } from '../request';
import { apiUp, checkApiStatus } from './apiState';

export type RequestActionOpts = {
  method: string,
  route: string,
  body?: any,
  files?: {},
  expected?: number | Array<number>,
}

function requestStartAction(prefix: string, method: string, route: string, body?: any): RequestStartAction {
  return {
    type: prefix + '_REQUEST',
    method,
    route,
    body,
  };
}

function requestSuccessAction(prefix: string, status: number, body: any): RequestSuccessAction {
  return {
    type: prefix + '_SUCCESS',
    status,
    body,
  };
}

function requestFailureAction(prefix: string, error: ApiRequestError): RequestFailureAction {
  return {
    type: prefix + '_FAILURE',
    error,
  };
}

export default function requestAction(prefix: string, opts: RequestActionOpts): ThunkAction {
  const { method, route, body, files, expected } = opts;

  return dispatch => {
    dispatch(requestStartAction(prefix, method, route, body));

    return request(method, route, body, files, expected)
      .then(
        ({ result, body }: RequestResult) => {
          dispatch(requestSuccessAction(prefix, result.status, body));
          dispatch(apiUp());

          return { status: result.status, body };
        },
        error => {
          dispatch(requestFailureAction(prefix, error));

          // FIXME
          if (error.message === 'Failed to fetch')
            dispatch(checkApiStatus('API_REQUEST_FAILED'));

          return { error };
        }
      );
  };
}

// @flow

import type { SetErrorAction, ClearErrorAction } from 'Types/actions';
import type { ErrorType } from 'Types/models';

export const SET_ERROR = 'SET_ERROR';
export function setError(error: ErrorType): SetErrorAction {
  return {
    type: SET_ERROR,
    error,
  };
}

export const CLEAR_ERROR = 'CLEAR_ERROR';
export function clearError(reason: string): ClearErrorAction {
  return {
    type: CLEAR_ERROR,
    reason,
  };
}

// @flow

import type { ClearErrorAction } from '../types/actions';

export const CLEAR_ERROR = 'CLEAR_ERROR';
export function clearError(reason: string): ClearErrorAction {
  return {
    type: CLEAR_ERROR,
    reason,
  };
}

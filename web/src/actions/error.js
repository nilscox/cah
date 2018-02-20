export const CLEAR_ERROR = 'CLEAR_ERROR';
export function clearError(reason) {
  return {
    type: CLEAR_ERROR,
    reason,
  };
}

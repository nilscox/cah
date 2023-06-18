import assert from 'node:assert';

export const defined = <T>(value: T | undefined, message?: string): T => {
  assert(value, message);
  return value;
};

export function assert<T>(value: T | undefined, message?: string): asserts value {
  if (value === undefined) {
    throw new Error(message ?? 'Assertion error');
  }
}

export function defined<T>(value: T | undefined, message?: string): T {
  assert(value, message);
  return value;
}

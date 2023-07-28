export function assert<T>(value: T | undefined): asserts value {
  if (!value) {
    throw new Error('Assertion error');
  }
}

export function defined<T>(value: T | undefined) {
  assert(value);
  return value;
}

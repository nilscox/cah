export class ValueObject<T> {
  protected value: T;

  constructor(value: T) {
    this.value = Object.freeze(value);
  }

  equal(other: ValueObject<unknown>) {
    return JSON.stringify(this.value) === JSON.stringify(other.value);
  }
}

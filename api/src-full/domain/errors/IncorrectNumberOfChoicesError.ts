export class IncorrectNumberOfChoicesError extends Error {
  constructor(public readonly received: number, public readonly expected: number) {
    super(`invalid number of choices, received ${received}, expected ${expected}`);
    Object.setPrototypeOf(this, IncorrectNumberOfChoicesError.prototype);
  }
}

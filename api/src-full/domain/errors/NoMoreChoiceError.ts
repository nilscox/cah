export class NoMoreChoiceError extends Error {
  constructor() {
    super('no more choices');
    Object.setPrototypeOf(this, NoMoreChoiceError.prototype);
  }
}

export class IsNotQuestionMasterError extends Error {
  constructor() {
    super();
    Object.setPrototypeOf(this, IsNotQuestionMasterError.prototype);
  }
}

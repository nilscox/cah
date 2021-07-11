export class AnswerNotFoundError extends Error {
  constructor(answerId: number) {
    super(`answer with id ${answerId} was not found`);
    Object.setPrototypeOf(this, AnswerNotFoundError.prototype);
  }
}

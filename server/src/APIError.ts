export default class APIError extends Error {

  private status: number;

  constructor(status: number, message: string) {
    super(message);

    this.status = status;
  }

}

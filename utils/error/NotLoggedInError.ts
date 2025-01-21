export class NotLoggedInError extends Error {
  constructor() {
    super();

    this.name = "NotLoggedInError";
  }
}

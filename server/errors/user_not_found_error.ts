export class UserNotFoundError extends Error {
  constructor(identifier: string | null) {
    super();
    this.message = `User ${identifier} is not found`;
  }
}

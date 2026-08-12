export class AuthenticationRequiredError extends Error {
  constructor() {
    super("Authentication is required.");
    this.name = "AuthenticationRequiredError";
  }
}

export class AuthorizationError extends Error {
  constructor(message = "You do not have permission to perform this action.") {
    super(message);
    this.name = "AuthorizationError";
  }
}

export class TenantUnavailableError extends Error {
  constructor(
    message = "No active organization is available for this session.",
  ) {
    super(message);
    this.name = "TenantUnavailableError";
  }
}

export class ConflictError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "ConflictError";
  }
}

export class NotFoundError extends Error {
  constructor(message = "The requested record was not found.") {
    super(message);
    this.name = "NotFoundError";
  }
}

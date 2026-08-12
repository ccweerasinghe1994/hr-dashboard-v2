import { isConstraintConflict } from "./database-errors";
import { ConflictError, NotFoundError, TenantUnavailableError } from "./errors";

export function bootstrapErrorMessage(error: unknown) {
  if (error instanceof ConflictError) return error.message;
  if (isConstraintConflict(error)) {
    return "That email address or organization slug is already in use.";
  }
  return null;
}

export function legalEntityMutationErrorMessage(error: unknown) {
  if (
    error instanceof ConflictError ||
    error instanceof NotFoundError ||
    error instanceof TenantUnavailableError
  ) {
    return error.message;
  }
  if (isConstraintConflict(error)) {
    return "That legal name or identifier conflicts with another effective record in this organization.";
  }
  return null;
}

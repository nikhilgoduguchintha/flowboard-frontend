// ─── Base ─────────────────────────────────────────────────────────────────────

export class ApiError extends Error {
  status: number;

  constructor(message: string, status: number) {
    super(message);
    this.name = "ApiError";
    this.status = status;
  }
}

// ─── Specific Error Classes ───────────────────────────────────────────────────

export class AuthError extends ApiError {
  constructor(message = "Authentication required") {
    super(message, 401);
    this.name = "AuthError";
  }
}

export class ForbiddenError extends ApiError {
  constructor(message = "You do not have permission to perform this action") {
    super(message, 403);
    this.name = "ForbiddenError";
  }
}

export class NotFoundError extends ApiError {
  constructor(message = "The requested resource was not found") {
    super(message, 404);
    this.name = "NotFoundError";
  }
}

export class ValidationError extends ApiError {
  fields: Record<string, string>;

  constructor(message: string, fields: Record<string, string> = {}) {
    super(message, 400);
    this.name = "ValidationError";
    this.fields = fields;
  }
}

export class ServerError extends ApiError {
  constructor(message = "Something went wrong on our end") {
    super(message, 500);
    this.name = "ServerError";
  }
}

export class NetworkError extends Error {
  constructor(message = "Network error — please check your connection") {
    super(message);
    this.name = "NetworkError";
  }
}

// ─── Error Factory ────────────────────────────────────────────────────────────
// Maps HTTP status codes to typed error classes

export function createApiError(
  status: number,
  message: string,
  fields?: Record<string, string>
): ApiError {
  switch (status) {
    case 400:
      return new ValidationError(message, fields);
    case 401:
      return new AuthError(message);
    case 403:
      return new ForbiddenError(message);
    case 404:
      return new NotFoundError(message);
    case 500:
    default:
      return new ServerError(message);
  }
}

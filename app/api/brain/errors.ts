export class BrainError extends Error {
  constructor(message: string) {
    super(message);

    this.name = "BrainError";
  }
}

export class ValidationError extends BrainError {
  constructor(message: string) {
    super(message);

    this.name = "ValidationError";
  }
}

export class AgentError extends BrainError {
  constructor(message: string) {
    super(message);

    this.name = "AgentError";
  }
}

export class RouterError extends BrainError {
  constructor(message: string) {
    super(message);

    this.name = "RouterError";
  }
}
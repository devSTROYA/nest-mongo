import { UseCaseError } from './usecase';

export namespace JobErrors {
  export class ParameterMissing extends UseCaseError {
    private constructor(message: string) {
      super(message);
    }

    static create(payload: string[]) {
      return new ParameterMissing(`Missing ${payload.toString()}`);
    }
  }

  export class NodeNotFound extends UseCaseError {
    private constructor(message: string) {
      super(message);
    }

    static create(id: string[]) {
      return new NodeNotFound(`Target ${id.toString()} not found`);
    }
  }

  export class JobNotFound extends UseCaseError {
    private constructor(message: string) {
      super(message);
    }

    static create(id: string) {
      return new JobNotFound(`Job Id ${id} not found`);
    }
  }

  export class JobAlreadyCompleted extends UseCaseError {
    private constructor(message: string) {
      super(message)
    }

    static create() {
      return new JobAlreadyCompleted(undefined);
    }
  }
}
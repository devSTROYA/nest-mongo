export interface UseCase<Req, Res> {
  execute(request: Req): Res;
}

export class UseCaseError {
  readonly message: string;

  constructor(message: string) {
    this.message = message;
  }
}
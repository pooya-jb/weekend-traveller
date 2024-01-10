import { Request, Response } from 'express';

class CustomError extends Error {
  override name: string = 'Custom error name';
  number: number = 0;
  clientMessage: string = this.message;
  constructor(message: string) {
    super(message);
  }
}

interface Errors {
  [key: string]: typeof CustomError;
}
export const errors: Errors = {};

export class BadRequest extends CustomError {
  override name: string = 'Bad request';
  override number: number = 400;
  constructor(message: string) {
    super(message);
  }
}

export class NotFound extends CustomError {
  override name: string = 'Not found';
  override number: number = 404;
  constructor(message: string) {
    super(message);
  }
}

export class InternalServerError extends CustomError {
  override name: string = 'Internal Server Error';
  override number: number = 500;
  override clientMessage: string = 'Unable to resolve. Please try again later.';
  constructor(message: string) {
    super(message);
  }
}

errors[BadRequest.name] = BadRequest;
errors[NotFound.name] = NotFound;
errors[InternalServerError.name] = InternalServerError;
// next(new errors.BadRequest('Missing request parameter(s)'));

export function errorHandler(
  err: CustomError,
  _: Request,
  res: Response,
  __: Function
): void {
  console.error(err.stack);
  res.status(err.number);
  res.send(err.clientMessage);
}

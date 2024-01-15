/**
 * @module
 * Handles all error reporting.
 * Methods listed here are used to encapsulate entire processes
 * so that no errors threaten runtime of server.
 * Use only Error class overloads listed here to raise errors!
 * @version 1.0.0
 */

//  External dependencies
import { Request, Response } from 'express';

/**
 * Error class overloads defining common error scenarios.
 * All errors are added to errors export which should be used to raise errors:
 *
 * import { errors } from '.../errorHandler.ts';
 * next(new errors.BadRequest('Missing request parameter(s)'));
 */
class CustomError extends Error {
  /**
   * @var number HTTP status code associated with error
   * @var clientMessage used when different message should be logged
   *      and different one sent to user
   */
  override name: string = 'Custom error name';
  number: number = 0;
  clientMessage: string = this.message;
  constructor(message: string) {
    super(message);
  }
}
class BadRequest extends CustomError {
  override name: string = 'Bad request';
  override number: number = 400;
  constructor(message: string) {
    super(message);
  }
}
class NotFound extends CustomError {
  override name: string = 'Not found';
  override number: number = 404;
  constructor(message: string) {
    super(message);
  }
}
class InternalServerError extends CustomError {
  override name: string = 'Internal Server Error';
  override number: number = 500;
  override clientMessage: string =
    'Unable to resolve request. Please try again later.';
  constructor(message: string) {
    super(message);
  }
}
class BadGateway extends CustomError {
  override name: string = 'Bad gateway';
  override number: number = 502;
  override clientMessage: string =
    'Unable to load data. Please try again later.';
  constructor(message: string) {
    super(message);
  }
}

//  Custom error constructors
interface Errors {
  [key: string]: typeof CustomError;
}
export const errors: Errors = {};
errors[BadRequest.name] = BadRequest;
errors[NotFound.name] = NotFound;
errors[InternalServerError.name] = InternalServerError;
errors[BadGateway.name] = BadGateway;
// call: next(new errors.BadRequest('Missing request parameter(s)'));

/**
 * Custom error intended for cases where specific error is not known
 * and error was caught by global error handler.
 * Automatically categorises the error as Internal server error.
 * Must be in sync with CustomError class.
 *
 * I chose to use completely separate branch of error overloads for this
 * to avoid spaghetti constructor and if merged.
 */
export class UnknownError extends Error {
  /**
   * @var number HTTP status code associated with error
   * @var clientMessage used when different message should be logged
   *      and different one sent to user
   */
  number: number = 0;
  clientMessage: string = this.message;
  constructor(error: Error) {
    super(error.message);
    this.stack = <string>error.stack;
    const errorForCopy: CustomError = Object.assign(
      new InternalServerError(error.message),
      error
    );
    this.name = errorForCopy.name;
    this.number = errorForCopy.number;
    this.clientMessage = errorForCopy.clientMessage;
  }
}

/**
 * Logs error in uniform way.
 * @param err to be logged
 */
export const errorLogger = (err: CustomError) => {
  console.error(err.number, err.stack);
};

/**
 * Custom error handler for express.
 * Handles error logging and sending correct response to request origin.
 * @param err to be handled
 * @param res to be returned to requester
 */
export const errorHandler = (
  err: CustomError,
  _: Request,
  res: Response,
  __: Function
): void => {
  errorLogger(err);
  res.status(err.number);
  res.send(err.clientMessage);
};

/**
 * Must be used as top caller in all routes!
 * Ensures all unhandled errors are caught and sent to error handler
 * by encapsulating given function with try-catch.
 * @param fn function to be encapsulated in try-catch.
 */
export const errorCatcher = (fn: Function) => {
  return async (req: Request, res: Response, next: Function) => {
    try {
      await fn(req, res, next);
    } catch (err) {
      if (!res.headersSent) next(new UnknownError(<Error>err));
    }
  };
};

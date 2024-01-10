import express, { Request, Response, Router } from 'express';

import { errors } from './middleware/errorHandler.js';

export const router: Router = express.Router();

router.get('/*', (_: Request, __: Response, next: Function) => {
  next(new errors.NotFound("Page doesn't exist"));
});

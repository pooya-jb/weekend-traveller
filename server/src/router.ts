import express, { Request, Response, Router } from 'express';

import { errors, UnknownError } from './middleware/errorHandler.js';
import * as flightData from './controllers/flightData.controller.js';

export const router: Router = express.Router();

function errorCatcher(fn: Function) {
  return async (req: Request, res: Response, next: Function) => {
    try {
      await fn(req, res, next);
    } catch (err) {
      if (!res.headersSent) next(new UnknownError(<Error>err));
    }
  };
}

router.get('/currencies', errorCatcher(flightData.getCurrencies));
router.get('/airports/:locale', errorCatcher(flightData.getAirports));
router.post(
  '/request-locale-info',
  errorCatcher(flightData.postLocaleInfoRequest)
);
router.post(
  '/request-cheapest-flights',
  errorCatcher(flightData.postCheapestFlightsRequest)
);
router.post(
  '/request-flight-info',
  errorCatcher(flightData.postFlightInfoRequest)
);
router.all('/*', (_: Request, __: Response, next: Function) => {
  next(new errors.NotFound(`Page doesn't exist.`));
});

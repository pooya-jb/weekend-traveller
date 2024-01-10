import express, { Request, Response, Router } from 'express';

import { errors } from './middleware/errorHandler.js';
import * as flightData from './controllers/flightData.controller.js';

export const router: Router = express.Router();

function catcher(fn: Function) {
  return async (req: Request, res: Response, next: Function) => {
    try {
      await fn(req, res, next);
    } catch (err) {
      if (!res.headersSent) next(new errors.InternalServerError(<Error>err));
    }
  };
}

router
  .get('/currencies', catcher(flightData.getCurrencies))
  .get('/airports', catcher(flightData.getAirports))
  .post('/request-locale-info', catcher(flightData.postLocaleInfoRequest))
  .post(
    '/request-cheapest-flights',
    catcher(flightData.postCheapestFlightsRequest)
  )
  .post('/request-flight-info', catcher(flightData.postFlightInfoRequest))
  .all('/*', (_: Request, __: Response, next: Function) => {
    next(new errors.NotFound(`Page doesn't exist.`));
  });

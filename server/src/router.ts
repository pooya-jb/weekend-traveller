import express, { Request, Response, Router } from 'express';

import { errors } from './middleware/errorHandler.js';
import * as flightData from './controllers/flightData.controller.js';

export const router: Router = express.Router();

router
  .get('/currencies', flightData.getCurrencies)
  .get('/airports', flightData.getAirports)
  .post('/request-locale-info', flightData.postLocaleInfoRequest)
  .post('/request-cheapest-flights', flightData.postCheapestFlightsRequest)
  .post('/request-flight-info', flightData.postFlightInfoRequest)
  .all('/*', (_: Request, __: Response, next: Function) => {
    next(new errors.NotFound(`Page doesn't exist.`));
  });

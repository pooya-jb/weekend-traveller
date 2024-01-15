/**
 * @module
 * Default server router.
 * Routes are ordered by request type and alphabetically.
 * POST method is used where potentially sensitive request parameters are used.
 * All routes must always be wrapped in errorCatcher.
 * @version 1.0.0
 */

//  External dependencies
import express, { Request, Response, Router } from 'express';

//  Internal dependencies
import { errors, errorCatcher } from './middleware/errorHandler.js';
import * as flightData from './controllers/flightData.controller.js';

export const router: Router = express.Router();

//  GET routes
router.get('/currencies', errorCatcher(flightData.getCurrencies));
router.get('/airports', errorCatcher(flightData.getAirports));

//  POST routes
router.post(
  '/request-cheapest-flights',
  errorCatcher(flightData.postCheapestFlightsRequest)
);
router.post(
  '/request-flight-info',
  errorCatcher(flightData.postFlightInfoRequest)
);
router.post(
  '/request-locale-info',
  errorCatcher(flightData.postLocaleInfoRequest)
);

//  Default 404 route
router.all('/*', (_: Request, __: Response, next: Function) => {
  next(new errors.NotFound(`Page doesn't exist.`));
});

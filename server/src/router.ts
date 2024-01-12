/**
 * @module
 * Default server router.
 * Routes are ordered by request type and alphabetically.
 * POST method is used where request parameters are needed.
 * All routes must always be wrapped in errorCatcher.
 *
 * @author Daniel Maczak
 * @version 1.0.0
 */

//  External dependencies
import express, { Request, Response, Router } from 'express';

//  Internal dependencies
import { errors, errorCatcher } from './middleware/errorHandler.js';
import * as flightData from './controllers/flightData.controller.js';

export const router: Router = express.Router();

//  GET routes
router.get('/airports', errorCatcher(flightData.getAirports));
router.get('/currencies', errorCatcher(flightData.getCurrencies));

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

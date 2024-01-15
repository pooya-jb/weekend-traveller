/**
 * @module
 * Top level request delegation.
 * Only extracts all resources related to request
 * and passes it to dedicated model.
 * Positive response is given unless error is thrown anywhere in the model.
 * Checking inputs is model's responsibility.
 * @version 1.0.0
 */

//  External dependencies
import { Request, Response } from 'express';

//  Internal dependencies
import * as model from '../models/flightData.model.js';
import * as libFd from '../libraries/flightData.model.js';

export const getCurrencies = async (
  _: Request,
  res: Response
): Promise<void> => {
  const data: string[] = await model.getCurrencies();
  res.status(200);
  res.json(data);
};

export const getAirports = async (_: Request, res: Response): Promise<void> => {
  const data: Map<string, string> = await model.getAirports();
  res.status(200);
  res.json([...data]);
};

export const postLocaleInfoRequest = async (
  req: Request,
  res: Response
): Promise<void> => {
  const ipAddress: string = req.body.ipAddress;
  const data: libFd.LocaleInfo = await model.postLocaleInfoRequest(ipAddress);
  res.status(200);
  res.json(data);
};

export const postCheapestFlightsRequest = async (
  req: Request,
  res: Response
): Promise<void> => {
  const requestBody: libFd.CheapestFlightsRequest = req.body;
  const data: libFd.CheapestFlights = await model.postCheapestFlightsRequest(
    requestBody
  );
  res.status(200);
  res.json(data);
};

export const postFlightInfoRequest = async (
  req: Request,
  res: Response
): Promise<void> => {
  const requestBody: libFd.FlightInfoRequest = req.body;
  const data: libFd.FlightInfo = await model.postFlightInfoRequest(requestBody);
  res.status(200);
  res.json(data);
};

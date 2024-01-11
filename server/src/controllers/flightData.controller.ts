import { Request, Response } from 'express';

import { errors } from '../middleware/errorHandler.js';
import * as model from '../models/flightData.model.js';
import * as libFd from '../libraries/flightData.model.js';

const localeFilter: RegExp = /^[a-z]{2}\-[A-Z]{2}$/;
const ipFilter: RegExp = /^(\d{1,3}\.){3}\d{1,3}$/;

export const getCurrencies = async (
  _: Request,
  res: Response
): Promise<void> => {
  //  Request data
  const data: string[] = await model.getCurrencies();
  //  Respond
  res.status(200);
  res.json(data);
};

export const getAirports = async (
  req: Request,
  res: Response
): Promise<void> => {
  //  Request data
  const locale: string = req.params.locale;
  if (!localeFilter.test(locale))
    throw new errors.BadRequest('Incorrect user input.');
  const data: Map<string, string> = await model.getAirports(locale);
  //  Respond
  res.status(200);
  res.json([...data]);
};

export const postLocaleInfoRequest = async (
  req: Request,
  res: Response
): Promise<void> => {
  //  Request data
  const ipAddress: string = req.body.ipAddress;
  if (!ipFilter.test(ipAddress))
    throw new errors.BadRequest('Incorrect user input.');
  const data: libFd.LocaleInfo = await model.postLocaleInfoRequest(ipAddress);
  //  Respond
  res.status(200);
  res.json(data);
};

export const postCheapestFlightsRequest = async (
  req: Request,
  res: Response
): Promise<void> => {
  //  Request data
  const requestBody: libFd.CheapestFlightsRequest = req.body;
  if (!(requestBody instanceof Object))
    throw new errors.BadRequest('Incorrect user input.');
  const data: libFd.CheapestFlights = await model.postCheapestFlightsRequest(
    requestBody
  );
  //  Respond
  res.status(200);
  res.json(data);
};

export const postFlightInfoRequest = async (): Promise<void> => {};

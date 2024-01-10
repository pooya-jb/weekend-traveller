import { Request, Response } from 'express';

import { errors } from '../middleware/errorHandler.js';
import * as model from '../models/flightData.model.js';
import * as libFd from '../libraries/flightData.model.js';

export const getCurrencies = async (
  _: Request,
  res: Response,
  next: Function
): Promise<void> => {
  try {
    //  Request data
    const data: libFd.Currencies | null = await model.getCurrencies();
    if (data === null) next(new errors.BadGateway('No data received'));
    //  Respond
    res.status(200);
    res.json(data);
  } catch (err) {
    next(new errors.InternalServerError(<Error>err));
  }
};

export const getAirports = async (): Promise<void> => {};
export const postLocaleInfoRequest = async (): Promise<void> => {};
export const postCheapestFlightsRequest = async (): Promise<void> => {};
export const postFlightInfoRequest = async (): Promise<void> => {};

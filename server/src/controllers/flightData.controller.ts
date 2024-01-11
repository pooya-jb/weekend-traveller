import { Request, Response } from 'express';

import * as model from '../models/flightData.model.js';
import * as libFd from '../libraries/flightData.model.js';

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
  const ipAddress: string = req.body?.ipAddress;
  const data: libFd.LocaleInfo = await model.postLocaleInfoRequest(ipAddress);
  //  Respond
  res.status(200);
  res.json(data);
};

export const postCheapestFlightsRequest = async (): Promise<void> => {};

export const postFlightInfoRequest = async (): Promise<void> => {};

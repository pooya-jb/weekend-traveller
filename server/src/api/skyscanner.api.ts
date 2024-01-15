/**
 * @module
 * Imports from skyscanner API.
 * All processes follow standard fetch pattern.
 * All data processing is handled by model.
 * API response code is checked;
 * in all other cases relies on global error catcher.
 * @version 1.0.0
 * @link https://developers.skyscanner.net/docs/intro
 * @link https://html.duckduckgo.com/html?q=skyscanner%20developer%20api
 */

//  Internal dependencies
import { errors } from '../middleware/errorHandler.js';
import * as libApi from '../libraries/skyscanner.api.js';

//  Skyscanner API URL
const BASE_URL: string = 'https://partners.api.skyscanner.net/apiservices/v3';

export const getCurrencies = async (): Promise<libApi.Currencies> => {
  const url: string = `${BASE_URL}/culture/currencies`;
  const response = await fetch(url, {
    headers: { 'x-api-key': process.env.SKYSCANNER_API_KEY },
  });
  if (!response.ok)
    throw new errors.BadGateway(`API server responded ${response.status}.`);
  const data: libApi.Currencies = await response.json();
  return data;
};

export const getGeoHierarchy = async (
  locale: string
): Promise<libApi.GeoHierarchy> => {
  const url: string = `${BASE_URL}/geo/hierarchy/flights/${locale}`;
  const response = await fetch(url, {
    headers: { 'x-api-key': process.env.SKYSCANNER_API_KEY },
  });
  if (!response.ok)
    throw new errors.BadGateway(`API server responded ${response.status}.`);
  const data: libApi.GeoHierarchy = await response.json();
  return data;
};

export const getNearestCulture = async (
  ipAddress: string
): Promise<libApi.NearestCulture> => {
  const url: string = `${BASE_URL}/culture/nearestculture?ipAddress=${ipAddress}`;
  const response = await fetch(url, {
    headers: { 'x-api-key': process.env.SKYSCANNER_API_KEY },
  });
  if (!response.ok)
    throw new errors.BadGateway(`API server responded ${response.status}.`);
  const data: libApi.NearestCulture = await response.json();
  return data;
};

export const postFlightsIndicativeRequest = async (
  requestBody: libApi.FlightsIndicativeRequest
): Promise<libApi.FlightsIndicative> => {
  const url: string = `${BASE_URL}/flights/indicative/search`;
  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-type': 'application/json',
      'x-api-key': process.env.SKYSCANNER_API_KEY,
    },
    body: JSON.stringify(requestBody),
  });
  if (!response.ok)
    throw new errors.BadGateway(`API server responded ${response.status}.`);
  const data: libApi.FlightsIndicative = await response.json();
  return data;
};

export const postFlightsLivePricesRequest = async (
  requestBody: libApi.FlightsLivePricesRequest
): Promise<libApi.FlightsLivePrices> => {
  const url: string = `${BASE_URL}/flights/live/search/create`;
  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-type': 'application/json',
      'x-api-key': process.env.SKYSCANNER_API_KEY,
    },
    body: JSON.stringify(requestBody),
  });
  if (!response.ok)
    throw new errors.BadGateway(`API server responded ${response.status}.`);
  const data: libApi.FlightsLivePrices = await response.json();
  return data;
};

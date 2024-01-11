import * as libApi from '../libraries/skyscanner.api.js';

const baseUrl: string = 'https://partners.api.skyscanner.net/apiservices/v3';

export const getCurrencies = async (): Promise<libApi.Currencies> => {
  //  Request flight data
  const url: string = `${baseUrl}/culture/currencies`;
  const response = await fetch(url, {
    headers: { 'x-api-key': process.env.SKYSCANNER_API_KEY },
  });
  //  Process response
  if (!response.ok) throw new Error();
  const data: libApi.Currencies = await response.json();
  return data as libApi.Currencies;
};

export const getGeoHierarchy = async (
  locale: string
): Promise<libApi.GeoHierarchy> => {
  //  Request flight data
  const url: string = `${baseUrl}/geo/hierarchy/flights/${locale}`;
  const response = await fetch(url, {
    headers: { 'x-api-key': process.env.SKYSCANNER_API_KEY },
  });
  //  Process response
  if (!response.ok) throw new Error();
  const data: libApi.GeoHierarchy = await response.json();
  return data as libApi.GeoHierarchy;
};

export const getNearestCulture = async (
  ipAddress: string
): Promise<libApi.NearestCulture> => {
  //  Request flight data
  const url: string = `${baseUrl}/culture/nearestculture?ipAddress=${ipAddress}`;
  const response = await fetch(url, {
    headers: { 'x-api-key': process.env.SKYSCANNER_API_KEY },
  });
  //  Process response
  if (!response.ok) throw new Error();
  const data: libApi.NearestCulture = await response.json();
  return data as libApi.NearestCulture;
};

export const postFlightsIndicativeRequest = async (
  requestBody: libApi.FlightsIndicativeRequest
): Promise<libApi.FlightsIndicative> => {
  //  Request flight data
  const url: string = `${baseUrl}/flights/indicative/search`;
  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-type': 'application/json',
      'x-api-key': process.env.SKYSCANNER_API_KEY,
    },
    body: JSON.stringify(requestBody),
  });
  //  Process response
  if (!response.ok) throw new Error();
  const data: libApi.FlightsIndicative = await response.json();
  return data as libApi.FlightsIndicative;
};

export const postFlightsLivePricesRequest = async (
  requestBody: libApi.FlightsLivePricesRequest
): Promise<libApi.FlightsLivePrices> => {
  //  Request flight data
  const url: string = `${baseUrl}/flights/live/search/create`;
  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-type': 'application/json',
      'x-api-key': process.env.SKYSCANNER_API_KEY,
    },
    body: JSON.stringify(requestBody),
  });
  //  Process response
  if (!response.ok) throw new Error();
  const data: libApi.FlightsLivePrices = await response.json();
  return data as libApi.FlightsLivePrices;
};

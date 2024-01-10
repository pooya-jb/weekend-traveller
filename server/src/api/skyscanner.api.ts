import * as lib from '../libraries/skyscanner.api.js';

const baseUrl: string = 'https://partners.api.skyscanner.net/apiservices/v3';

export const getCurrencies = async (): Promise<lib.Currencies | null> => {
  try {
    //  Request flight data
    const url: string = `${baseUrl}/culture/currencies`;
    const response = await fetch(url, {
      headers: { 'x-api-key': process.env.SKYSCANNER_API_KEY },
    });
    //  Process response
    if (!response.ok) throw new Error();
    const data: lib.Currencies = await response.json();
    return data as lib.Currencies;
  } catch (err) {
    return null;
  }
};

export const getGeoHierarchy = async (
  locale: string
): Promise<lib.GeoHierarchy | null> => {
  try {
    if (!locale) throw new Error();
    //  Request flight data
    const url: string = `${baseUrl}/geo/hierarchy/flights/${locale}`;
    const response = await fetch(url, {
      headers: { 'x-api-key': process.env.SKYSCANNER_API_KEY },
    });
    //  Process response
    if (!response.ok) throw new Error();
    const data: lib.GeoHierarchy = await response.json();
    return data as lib.GeoHierarchy;
  } catch (err) {
    return null;
  }
};

export const getNearestCulture = async (
  ipAddress: string
): Promise<lib.NearestCulture | null> => {
  try {
    //  Request flight data
    const url: string = `${baseUrl}/culture/nearestculture?ipAddress=${ipAddress}`;
    const response = await fetch(url, {
      headers: { 'x-api-key': process.env.SKYSCANNER_API_KEY },
    });
    //  Process response
    if (!response.ok) throw new Error();
    const data: lib.NearestCulture = await response.json();
    return data as lib.NearestCulture;
  } catch (err) {
    return null;
  }
};

export const postFlightsIndicativeRequest = async (
  requestBody: lib.FlightsIndicativeRequest
): Promise<lib.FlightsIndicative | null> => {
  try {
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
    const data: lib.FlightsIndicative = await response.json();
    return data as lib.FlightsIndicative;
  } catch (err) {
    return null;
  }
};

export const postFlightsLivePricesRequest = async (
  requestBody: lib.FlightsLivePricesRequest
): Promise<lib.FlightsLivePrices | null> => {
  try {
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
    const data: lib.FlightsLivePrices = await response.json();
    return data as lib.FlightsLivePrices;
  } catch (err) {
    return null;
  }
};

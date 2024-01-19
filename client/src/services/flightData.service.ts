/**
 * @module
 * External flight data delivery from our webserver.
 * All loaded data is cached to avoid unnecessary duplicated calls.
 * All functions return null on error; this must be handled in caller.
 * @version 1.0.0
 */

//  Internal dependencies
import { as } from 'vitest/dist/reporters-trlZlObr.js';
import * as libFd from '../libraries/flightData.service';
import * as c from './const.service';

//  Data cache
let currencies: libFd.Currencies = [];
let airports: libFd.Airports;
let localeInfo: libFd.LocaleInfo;
let cheapestFlightsCache: { [key: string]: libFd.CheapestFlights } = {};
let flightInfoCache: { [key: string]: libFd.FlightInfo } = {};

/**
 * Loads list of currency codes.
 * List is transformed to fit Option format required by react-select.
 * @returns list of currency codes
 */
export const getCurrencies = async (): Promise<libFd.Currencies | null> => {
  try {
    //  Check cache
    if (currencies && currencies.length) return currencies;

    //  Not cached yet, request data
    const response = await fetch(`${c.SERVER_URL}/currencies`);
    if (!response.ok) throw new Error(response.statusText);
    const data: string[] = await response.json();

    //  Transform data and update cache
    currencies = data.map((currency) => ({ value: currency, label: currency }));
    return currencies;
  } catch (err) {
    return null;
  }
};

/**
 * Loads list of airport IDs and names.
 * List is transformed to fit Option format required by react-select.
 * @returns list of airports
 */
export const getAirports = async (): Promise<libFd.Airports | null> => {
  try {
    //  Check cache
    if (airports && airports.length) return airports;

    //  Not cached yet, request data
    const response = await fetch(`${c.SERVER_URL}/airports`);
    if (!response.ok) throw new Error(response.statusText);
    const data: [string, string][] = await response.json();

    //  Transform data and update cache
    airports = data.map((airport) => ({
      value: airport[0],
      label: airport[1],
    }));
    return airports;
  } catch (err) {
    return null;
  }
};

/**
 * Loads locale info based on user's IP.
 * External API is used for IP request.
 * @returns locale info
 */
export const postLocaleInfoRequest =
  async (): Promise<libFd.LocaleInfo | null> => {
    try {
      //  Check cache
      if (localeInfo) return localeInfo;

      //  Obtain user's IP
      const responseIp = await fetch(c.IP_REQUEST_URL);
      if (!responseIp.ok) throw new Error(responseIp.statusText);
      const ipInfo = await responseIp.json();
      if (ipInfo?.ip === undefined)
        throw new Error(`Failed to obtain user's IP`);
      console.log(ipInfo);
      // getting the user locale data based on the IP address
      const localeRes = await fetch(`http://ip-api.com/json/${ipInfo.ip}`);
      const localeData = await localeRes.json();
      console.log(localeData, localeData.city);

      //  Request data
      const responseLocale = await fetch(
        `${c.SERVER_URL}/request-locale-info`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ ipAddress: ipInfo.ip }),
        }
      );
      if (!responseLocale.ok) throw new Error(responseLocale.statusText);
      const dataLocale: libFd.LocaleInfo = await responseLocale.json();
      console.log(dataLocale);
      //  Update cache
      localeInfo = dataLocale;
      return { ...dataLocale, city: localeData.city };
    } catch (err) {
      return null;
    }
  };

/**
 * Loads sorted list of cheapest flights for selected time range.
 * @param requestBody complete request information
 * @returns object of cheapest flight arrays per day
 */
export const postCheapestFlightsRequest = async (
  requestBody: libFd.CheapestFlightsRequest
): Promise<libFd.CheapestFlights | null> => {
  try {
    //  Check cache
    const requestJSON: string = JSON.stringify(requestBody);
    if (cheapestFlightsCache[requestJSON])
      return cheapestFlightsCache[requestJSON];

    //  Not cached yet, request data
    const response = await fetch(`${c.SERVER_URL}/request-cheapest-flights`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: requestJSON,
    });
    if (!response.ok) throw new Error(response.statusText);
    const data: libFd.CheapestFlights = await response.json();

    //  Update cache
    cheapestFlightsCache[requestJSON] = data;
    return data;
  } catch (err) {
    return null;
  }
};

/**
 * Loads details for single requested flight.
 * This API is very limited and is sometimes unresponsive.
 * This cannot be avoided as long as using public API key.
 * @link https://developers.skyscanner.net/docs/getting-started/rate-limits
 * @param requestBody complete request information
 * @returns object of flight details
 */
export const postFlightInfoRequest = async (
  requestBody: libFd.FlightInfoRequest
): Promise<libFd.FlightInfo | null> => {
  try {
    //  Check cache
    const requestJSON: string = JSON.stringify(requestBody);
    if (flightInfoCache[requestJSON]) return flightInfoCache[requestJSON];

    //  Not cached yet, request data
    const response = await fetch(`${c.SERVER_URL}/request-flight-info`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(requestBody),
    });
    if (!response.ok) throw new Error(response.statusText);
    const data: libFd.FlightInfo = await response.json();

    //  Update cache
    flightInfoCache[requestJSON] = data;
    return data;
  } catch (err) {
    return null;
  }
};

//  Internal dependencies
import * as libFd from '../libraries/flightData.service';
import * as c from '../services/const.service';

//  Data cache
let currencies: libFd.Currencies = [];
let airports: libFd.Airports;
let localeInfo: libFd.LocaleInfo;
let cheapestFlightsCache: { [key: string]: libFd.CheapestFlights } = {};
let flightInfoCache: { [key: string]: libFd.FlightInfo } = {};

export const getCurrencies = async (): Promise<libFd.Currencies | null> => {
  try {
    //  Check cache
    if (currencies && currencies.length) return currencies;
    //  Not cached yet, request data
    const response = await fetch(`${c.SERVER_URL}/currencies`);
    if (!response.ok) throw new Error(response.statusText);
    const data: string[] = await response.json();
    //  Transform data and update cache
    currencies = data.map(currency => ({ value: currency, label: currency }));
    return currencies;
  } catch (err) {
    return null;
  }
};

export const getAirports = async (): Promise<libFd.Airports | null> => {
  try {
    //  Check cache
    if (airports && airports.length) return airports;
    //  Not cached yet, request data
    const response = await fetch(`${c.SERVER_URL}/airports`);
    if (!response.ok) throw new Error(response.statusText);
    const data: [string, string][] = await response.json();
    //  Transform data and update cache
    airports = data.map(airport => ({ value: airport[0], label: airport[1] }));
    return airports;
  } catch (err) {
    return null;
  }
};

export const getAirportsPartition = async (
  limit: number,
  offset: number,
  search: string
): Promise<libFd.Airports | null> => {
  try {
    //  Trigger cache update if empty
    if (!airports) await getAirports();
    //  Filter data
    let partition = airports;
    if (search) {
      search = search.toLowerCase();
      partition = partition.filter(airport =>
        airport.label.toLowerCase().includes(search)
      );
    }
    return partition.slice(offset, limit + offset);
  } catch (err) {
    return null;
  }
};

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
      //  Update cache
      localeInfo = dataLocale;
      return dataLocale;
    } catch (err) {
      return null;
    }
  };

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

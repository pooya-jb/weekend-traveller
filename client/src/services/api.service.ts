import * as libFd from '../libraries/flightData.service';
import * as c from '../services/const.service';

let currencies: libFd.Currencies = [];
let airports: libFd.Airports;
let localeInfo: libFd.LocaleInfo;
let cheapestFlightsCache: { [key: string]: libFd.CheapestFlights } = {};

export const getCurrencies = async (): Promise<libFd.Currencies> => {
  //  TODO error handling
  if (currencies && currencies.length) return currencies; // feed from internal storage
  const response = await fetch(`${c.SERVER_URL}/currencies`);
  if (!response.ok) throw new Error();
  const data: string[] = await response.json();
  currencies = data.map(currency => ({ value: currency, label: currency }));
  return currencies;
};

export const getAirports = async (): Promise<libFd.Airports> => {
  //  TODO error handling
  if (airports && airports.length) return airports; // feed from internal storage
  const response = await fetch(`${c.SERVER_URL}/airports`);
  if (!response.ok) throw new Error();
  const data: [string, string][] = await response.json();
  airports = data.map(airport => ({ value: airport[0], label: airport[1] }));
  return airports;
};

export const getAirportsPartition = async (
  limit: number,
  offset: number,
  search: string
): Promise<libFd.Airports> => {
  //  TODO error handling
  if (!airports) await getAirports(); // feed from internal storage
  let partition = airports;
  if (search) {
    search = search.toLowerCase();
    partition = partition.filter(airport =>
      airport.label.toLowerCase().includes(search)
    );
  }
  return partition.slice(offset, limit + offset);
};

export const postLocaleInfoRequest = async (): Promise<libFd.LocaleInfo> => {
  //  TODO error handling
  if (localeInfo) return localeInfo;
  //  Obtain user's IP
  const responseIp = await fetch(c.IP_REQUEST_URL);
  if (!responseIp.ok) throw new Error();
  const ipInfo = await responseIp.json();
  if (ipInfo?.ip === undefined) throw new Error();
  //  Use the IP to obtain locale info
  const responseLocale = await fetch(`${c.SERVER_URL}/request-locale-info`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ ipAddress: ipInfo.ip }),
  });
  if (!responseLocale.ok) throw new Error();
  const dataLocale: libFd.LocaleInfo = await responseLocale.json();
  localeInfo = dataLocale;
  return dataLocale;
};

export const postCheapestFlightsRequest = async (
  requestBody: libFd.CheapestFlightsRequest
): Promise<libFd.CheapestFlights> => {
  //  TODO error handling
  const requestJSON: string = JSON.stringify(requestBody);
  if (cheapestFlightsCache[requestJSON])
    return cheapestFlightsCache[requestJSON];
  const response = await fetch(`${c.SERVER_URL}/request-cheapest-flights`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: requestJSON,
  });
  if (!response.ok) throw new Error();
  const data: libFd.CheapestFlights = await response.json();
  cheapestFlightsCache[requestJSON] = data;
  return data;
};

export const postFlightInfoRequest = async (
  requestBody: libFd.FlightInfoRequest
): Promise<libFd.FlightInfo> => {
  //  TODO error handling
  const response = await fetch(`${c.SERVER_URL}/request-flight-info`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(requestBody),
  });
  if (!response.ok) throw new Error();
  const data: libFd.FlightInfo = await response.json();
  return data;
};

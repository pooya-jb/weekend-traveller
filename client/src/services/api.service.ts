import * as libFd from '../libraries/flightData.service';

//  TODO put as global constants
const serverUrl = `http://localhost:3000`;
const ipRequestUrl = `https://api.ipify.org?format=json`;

let currencies: libFd.Currencies = [];
let airports: libFd.Airports;
let localeInfo: libFd.LocaleInfo;

export const getCurrencies = async (): Promise<libFd.Currencies> => {
  //  TODO error handling
  if (currencies.length) return currencies; // feed from internal storage
  const response = await fetch(`${serverUrl}/currencies`);
  if (!response.ok) throw new Error();
  const data: string[] = await response.json();
  currencies = data.map(currency => ({ value: currency, label: currency }));
  return currencies;
};

export const getAirports = async (): Promise<libFd.Airports> => {
  //  TODO error handling
  if (airports && airports.length) return airports; // feed from internal storage
  const response = await fetch(`${serverUrl}/airports`);
  if (!response.ok) throw new Error();
  const data: [string, string][] = await response.json();
  airports = data.map(airport => ({ value: airport[0], label: airport[1] }));
  return airports;
};

export const getAirportsPartition = async (
  limit: number,
  offset: number
): Promise<libFd.Airports> => {
  //  TODO error handling
  if (!airports) await getAirports(); // feed from internal storage
  return airports.slice(offset, limit + offset);
};

export const postLocaleInfoRequest = async (): Promise<libFd.LocaleInfo> => {
  //  TODO error handling
  if (localeInfo !== undefined) return localeInfo;
  //  Obtain user's IP
  const responseIp = await fetch(ipRequestUrl);
  if (!responseIp.ok) throw new Error();
  const ipInfo = await responseIp.json();
  if (ipInfo?.ip === undefined) throw new Error();
  //  Use the IP to obtain locale info
  const responseLocale = await fetch(`${serverUrl}/request-locale-info`, {
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
  const response = await fetch(`${serverUrl}/request-cheapest-flights`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(requestBody),
  });
  if (!response.ok) throw new Error();
  const data: libFd.CheapestFlights = await response.json();
  return data;
};

export const postFlightInfoRequest = async (
  requestBody: libFd.FlightInfoRequest
): Promise<libFd.FlightInfo> => {
  //  TODO error handling
  const response = await fetch(`${serverUrl}/request-flight-info`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(requestBody),
  });
  if (!response.ok) throw new Error();
  const data: libFd.FlightInfo = await response.json();
  return data;
};

import * as libFd from '../libraries/flightData.service';

//  TODO put as global constants
const serverUrl = `http://localhost:3000`;
const ipRequestUrl = `https://api.ipify.org?format=json`;

let currencies: string[] = [];
let localeInfo: libFd.LocaleInfo;

export const getCurrencies = async (): Promise<string[]> => {
  //  TODO error handling
  if (currencies.length) return currencies; // feed from internal storage
  const response = await fetch(`${serverUrl}/currencies`);
  if (!response.ok) throw new Error();
  const data: string[] = await response.json();
  currencies = data; // store in internal storage
  return data;
};

export const getAirports = async (
  limit: number,
  offset: number
): Promise<libFd.Airports> => {
  //  TODO error handling
  const response = await fetch(`${serverUrl}/airports/${limit}-${offset}`);
  if (!response.ok) throw new Error();
  const data: [string, string][] = await response.json();
  return data.map(airport => ({ value: airport[0], label: airport[1] }));
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

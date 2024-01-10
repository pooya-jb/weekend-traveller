import * as api from '../api/skyscanner.api.js';
import * as libApi from '../libraries/skyscanner.api.js';
import * as libFd from '../libraries/flightData.model.js';

export const getCurrencies = async (): Promise<libFd.Currencies | null> => {
  //  Obtain data from API
  const dataIn: libApi.Currencies | null = await api.getCurrencies();
  if (dataIn === null) return null;
  //  Process data for app
  let dataOut: libFd.Currencies = [];
  for (let currency of dataIn.currencies) dataOut.push(currency.code);
  dataOut = [...new Set(dataOut)].sort();
  return dataOut;
};

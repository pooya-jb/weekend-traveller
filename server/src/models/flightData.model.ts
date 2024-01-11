import { errors } from '../middleware/errorHandler.js';
import * as api from '../api/skyscanner.api.js';
import * as libApi from '../libraries/skyscanner.api.js';
import * as libFd from '../libraries/flightData.model.js';

export const getCurrencies = async (): Promise<libFd.Currencies> => {
  //  Obtain data from API
  const dataIn: libApi.Currencies = await api.getCurrencies();
  if (!(dataIn instanceof Object))
    throw new errors.BadGateway('Data retrieved in unknown format.');
  //  Process data for app
  let dataOut: libFd.Currencies = [];
  for (let currency of dataIn.currencies) dataOut.push(currency.code);
  if (!dataOut.length) throw new errors.BadGateway('No data to process.');
  dataOut = [...new Set(dataOut)].sort();
  return dataOut;
};

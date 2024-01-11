import { errors } from '../middleware/errorHandler.js';
import * as api from '../api/skyscanner.api.js';
import * as libApi from '../libraries/skyscanner.api.js';
import * as libFd from '../libraries/flightData.model.js';

const PLACE_TYPE_COUNTRY = 'PLACE_TYPE_COUNTRY';
const PLACE_TYPE_AIRPORTS = [
  'PLACE_TYPE_ISLAND',
  'PLACE_TYPE_CITY',
  'PLACE_TYPE_AIRPORT',
];

export const getCurrencies = async (): Promise<string[]> => {
  //  Obtain data from API
  const dataIn: libApi.Currencies = await api.getCurrencies();
  if (!(dataIn instanceof Object))
    throw new errors.BadGateway('Data retrieved in unknown format.');
  //  Process data to internal format
  const dataProc: string[] = [];
  for (let currency of dataIn.currencies) dataProc.push(currency.code);
  if (!dataProc.length) throw new errors.BadGateway('No data to process.');
  //  Format output
  const dataOut: string[] = [...new Set(dataProc)].sort();
  return dataOut;
};

export const getAirports = async (
  locale: string
): Promise<Map<string, string>> => {
  //  Obtain data from API
  const dataIn: libApi.GeoHierarchy = await api.getGeoHierarchy(locale);
  if (!(dataIn instanceof Object))
    throw new errors.BadGateway('Data retrieved in unknown format.');
  //  Process data to internal format
  const dataProc: Map<string, string> = new Map();
  for (let [placeId, place] of Object.entries(dataIn.places)) {
    if (place.iata && PLACE_TYPE_AIRPORTS.includes(place.type)) {
      //  Find parent country
      let parent = place;
      while (parent.parentId && parent.type !== PLACE_TYPE_COUNTRY) {
        parent = dataIn.places[parent.parentId];
      }
      //  Compose airport name
      let airport = `${place.name} (${place.iata})`.trim();
      if ((parent.type = PLACE_TYPE_COUNTRY)) airport += `, ${parent.name}`;
      dataProc.set(airport, placeId); // store in reversed logic for sort
    }
  }
  if (!Array.from(dataProc.keys()).length)
    throw new errors.BadGateway('No data to process.');
  //  Format output
  const dataOut: Map<string, string> = new Map();
  Array.from(dataProc.keys())
    .sort()
    .forEach((key: string) => {
      const placeId: string | undefined = dataProc.get(key);
      placeId !== undefined && dataOut.set(placeId, key); // reverse key-value logic
    });
  return dataOut;
};

export const postLocaleInfoRequest = async (
  ipAddress: string
): Promise<libFd.LocaleInfo> => {
  //  Obtain data from API
  const dataIn: libApi.NearestCulture = await api.getNearestCulture(ipAddress);
  if (!(dataIn instanceof Object))
    throw new errors.BadGateway('Data retrieved in unknown format.');
  //  Process data to internal format
  const dataProc: libFd.LocaleInfo = {
    marketCode: dataIn.market.code,
    locationName: dataIn.market.name,
    currencyCode: dataIn.market.currency,
    localeCode: dataIn.locale.code,
  };
  return dataProc;
};

export const postCheapestFlightsRequest = async (
  requestBody: libFd.CheapestFlightsRequest
): Promise<libFd.CheapestFlights> => {
  //  Obtain data for each requested week
  const dataProc: libFd.CheapestFlights = {};
  const dataOut: libFd.CheapestFlights = {};
  for (let addWeeks = 0; addWeeks < requestBody.lookAtWeeks; addWeeks++) {
    //  Generate date objects
    const addTime: number = addWeeks * 1000 * 3600 * 24 * 7;
    const travelDate: Date = new Date(requestBody.travelDate + addTime);
    const returnDate: Date | null =
      requestBody.returnDate !== undefined
        ? new Date(requestBody.returnDate + addTime)
        : null;
    //  Process request object to API format
    const requestBodyApi: libApi.FlightsIndicativeRequest = {
      query: {
        currency: requestBody.currencyCode,
        locale: requestBody.localeCode,
        market: requestBody.marketCode,
        queryLegs: [
          {
            originPlace: {
              queryPlace: {
                entityId: requestBody.originPlaceId,
              },
            },
            destinationPlace: {
              anywhere: true,
            },
            fixedDate: {
              year: travelDate.getFullYear(),
              month: travelDate.getMonth() + 1,
              day: travelDate.getDate(),
            },
          },
        ],
        cabinClass: 'CABIN_CLASS_ECONOMY',
      },
    };
    //  Generate return part of API format
    if (returnDate) {
      requestBodyApi.query.queryLegs.push({
        originPlace: {
          anywhere: true,
        },
        destinationPlace: {
          queryPlace: {
            entityId: requestBody.originPlaceId,
          },
        },
        fixedDate: {
          year: returnDate.getFullYear(),
          month: returnDate.getMonth() + 1,
          day: returnDate.getDate(),
        },
      });
    }
    //  Obtain data from API
    const dataIn: libApi.FlightsIndicative =
      await api.postFlightsIndicativeRequest(requestBodyApi);
    if (!(dataIn instanceof Object))
      throw new errors.BadGateway('Data retrieved in unknown format.');
    //  Process data to internal format
    const dateKey: string = travelDate.valueOf().toString();
    dataProc[dateKey] = [];
    const carriers = dataIn.content.results.carriers;
    for (let [_, quote] of Object.entries(dataIn.content.results.quotes)) {
      dataProc[dateKey].push({
        vendorTherePic:
          carriers[quote.outboundLeg.marketingCarrierId]?.imageUrl,
        vendorBackPic: carriers[quote.inboundLeg.marketingCarrierId]?.imageUrl,
        destinationPlaceId: quote.outboundLeg.destinationPlaceId,
        hasTransfers: !quote.isDirect,
        price: parseInt(quote.minPrice.amount),
      });
    }
    //  Format output
    dataOut[dateKey] = dataProc[dateKey].sort((a, b) => a.price - b.price);
  }
  return dataOut;
};

/**
 * @module
 * Resolves HTTP data requests handled by this server.
 * Provides middle layer between API and DB towards users,
 * via mapping data from original form to expected format.
 * This logic was chosen to avoid dependency of front-end on back-end changes.
 * Static resources are loaded from DB, rest from skyscanner API.
 * @version 1.0.0
 */

//  Internal dependencies
import { errors } from '../middleware/errorHandler.js';
import * as api from '../api/skyscanner.api.js';
import * as libApi from '../libraries/skyscanner.api.js';
import * as libFd from '../libraries/flightData.model.js';
import { Airports, Currencies } from '../databases/flightData.database.js';

//  API constants (update if API changes)
const CABIN_CLASS: string = 'CABIN_CLASS_ECONOMY';

/**
 * Loads currency code list from DB.
 * Data is sorted before sending for convenience.
 * @returns array of international currency codes
 * @throws if DB is empty
 */
export const getCurrencies = async (): Promise<string[]> => {
  //  Obtain data from database
  const dataProc: Currencies[] = await Currencies.findAll();
  if (!dataProc.length) throw new errors.BadGateway('Missing data in DB.');
  //  Format output
  const dataOut: string[] = dataProc.map(currency => currency.dataValues.code);
  dataOut.sort();
  return dataOut;
};

/**
 * Loads map of airports from DB.
 * Map is keyed by entityId from API but sorted by airport name for convenience.
 * This required map usage as object with numeric keys is always sorted by keys.
 * Supports lazy loading via parameters that specify part of table to load.
 * @param limit number of rows to load
 * @param offset offset from start of table for loaded rows
 * @returns map<airport id, airport name>
 * @throws if DB is empty
 */
export const getAirports = async (
  limit: number = 0,
  offset: number = 0
): Promise<Map<string, string>> => {
  //  Obtain data from database
  const dataProc: Airports[] =
    !limit && !offset
      ? await Airports.findAll()
      : await Airports.findAll({
          limit: limit,
          offset: offset,
          order: ['name'],
        });
  if (!dataProc.length) throw new errors.BadGateway('Missing data in DB.');
  //  Format output
  const dataOut: Map<string, string> = new Map();
  dataProc
    .sort((a, b) => a.dataValues.name.localeCompare(b.dataValues.name))
    .forEach((airport: Airports) => {
      const placeId: string = airport.dataValues.id;
      const place: string = airport.dataValues.name;
      if (!dataOut.has(placeId)) dataOut.set(placeId, place);
    });
  return dataOut;
};

/**
 * Provides info about user's language and location based on their IP.
 * @param ipAddress IP of user
 * @returns shallow object with user locale info
 * @throws if no data is provided or in unexpected format
 */
export const postLocaleInfoRequest = async (
  ipAddress: string
): Promise<libFd.LocaleInfo> => {
  //  Obtain data from API
  const dataIn: libApi.NearestCulture = await api.getNearestCulture(ipAddress);
  if (!(dataIn instanceof Object))
    throw new errors.BadGateway('Data retrieved in unknown format.');
  if (!Object.keys(dataIn).length)
    throw new errors.BadGateway('No data received from API.');
  //  Process data to internal format
  const dataProc: libFd.LocaleInfo = {
    marketCode: dataIn.market.code,
    locationName: dataIn.market.name,
    currencyCode: dataIn.market.currency,
    localeCode: dataIn.locale.code,
  };
  return dataProc;
};

/**
 * Converts information from requestBody param into object expected by API.
 * Request body contains information to calculate travelDate and returnDate
 * but they are used in multiple places so they come from parent.
 * @param requestBody contains inputs from user to query API
 * @param travelDate date of flight to destination
 * @param returnDate date of return flight
 * @returns request body in format expected by API
 */
const createRequestBodyApiCheapestFlight = (
  requestBody: libFd.CheapestFlightsRequest,
  travelDate: Date,
  returnDate: Date | null
): libApi.FlightsIndicativeRequest => {
  //  Generate return object
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
      cabinClass: CABIN_CLASS,
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
  return requestBodyApi;
};

/**
 * Requests all flights from origin location
 * for set of dates defined by requestBody.
 * Dates are calculated from initial travelDate per week for #X weeks.
 * Data from API is sort by price for convenience.
 * @param requestBody info necessary to compose API request
 * @returns array of flight objects by date sorted from cheapest
 * @throws if travel/return dates are not consecutive
 *         if no data is returned by API or in unexpected format
 */
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
    if (returnDate !== null && returnDate < travelDate)
      throw new errors.BadRequest('Incorrect user input.');
    //  Process request object to API format
    const requestBodyApi: libApi.FlightsIndicativeRequest =
      createRequestBodyApiCheapestFlight(requestBody, travelDate, returnDate);
    //  Obtain data from API
    const dataIn: libApi.FlightsIndicative =
      await api.postFlightsIndicativeRequest(requestBodyApi);
    if (!(dataIn instanceof Object))
      throw new errors.BadGateway('Data retrieved in unknown format.');
    if (!Object.keys(dataIn).length)
      throw new errors.BadGateway('No data received from API.');
    //  Process data to internal format
    const dateKey: string = travelDate.valueOf().toString();
    const carriers = dataIn.content.results.carriers;
    dataProc[dateKey] = [];
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

/**
 * Converts information from requestBody param into object expected by API.
 * Request body contains information to calculate travelDate and returnDate
 * but they are kept in parent for compliance with othe request processes.
 * @param requestBody contains inputs from user to query API
 * @param travelDate date of flight to destination
 * @param returnDate date of return flight
 * @returns request body in format expected by API
 */
const createRequestBodyApiFlightInfo = (
  requestBody: libFd.FlightInfoRequest,
  travelDate: Date,
  returnDate: Date | null
): libApi.FlightsLivePricesRequest => {
  //  Generate return object
  const requestBodyApi: libApi.FlightsLivePricesRequest = {
    query: {
      currency: requestBody.currencyCode,
      locale: requestBody.localeCode,
      market: requestBody.marketCode,
      queryLegs: [
        {
          originPlaceId: {
            entityId: requestBody.originPlaceId,
          },
          destinationPlaceId: {
            entityId: requestBody.destinationPlaceId,
          },
          date: {
            year: travelDate.getFullYear(),
            month: travelDate.getMonth() + 1,
            day: travelDate.getDate(),
          },
        },
      ],
      cabinClass: CABIN_CLASS,
      adults: 1,
    },
  };
  //  Generate return part of API format
  if (returnDate) {
    requestBodyApi.query.queryLegs.push({
      originPlaceId: {
        entityId: requestBody.destinationPlaceId,
      },
      destinationPlaceId: {
        entityId: requestBody.originPlaceId,
      },
      date: {
        year: returnDate.getFullYear(),
        month: returnDate.getMonth() + 1,
        day: returnDate.getDate(),
      },
    });
  }
  return requestBodyApi;
};

/**
 * Requests flights between 2 locations for specific date.
 * Return flight can be part of request.
 * @param requestBody info necessary to compose API request
 * @returns info of cheapest flight option
 * @throws if travel/return dates are not consecutive
 *         if no data is returned by API or in unexpected format
 */
export const postFlightInfoRequest = async (
  requestBody: libFd.FlightInfoRequest
): Promise<libFd.FlightInfo> => {
  //  Generate date objects
  const travelDate: Date = new Date(requestBody.travelDate);
  const returnDate: Date | null =
    requestBody.returnDate !== undefined
      ? new Date(requestBody.returnDate)
      : null;
  if (returnDate !== null && returnDate < travelDate)
    throw new errors.BadRequest('Incorrect user input.');
  //  Process request object to API format
  const requestBodyApi: libApi.FlightsLivePricesRequest =
    createRequestBodyApiFlightInfo(requestBody, travelDate, returnDate);
  //  Obtain data from API
  const dataIn: libApi.FlightsLivePrices =
    await api.postFlightsLivePricesRequest(requestBodyApi);
  if (!(dataIn instanceof Object))
    throw new errors.BadGateway('Data retrieved in unknown format.');
  if (!Object.keys(dataIn).length)
    throw new errors.BadGateway('No data received from API.');
  //  Access critical API data routes
  const cheapestItineraryId: string =
    dataIn.content.sortingOptions.cheapest[0].itineraryId;
  const cheapestItinerary =
    dataIn.content.results.itineraries[cheapestItineraryId];
  const price: string =
    cheapestItinerary.pricingOptions[0].items[0].price.amount;
  const vendorLink: string =
    cheapestItinerary.pricingOptions[0].items[0].deepLink;
  const fares = cheapestItinerary.pricingOptions[0].items[0].fares;
  const segments = dataIn.content.results.segments;
  const carriers = dataIn.content.results.carriers;
  //  Process data to internal format
  const dataProc: libFd.FlightInfo = {
    segments: [],
    vendorLink: vendorLink,
    price: Number(price) / 1000,
  };
  for (let fare of fares) {
    const segmentId: string = fare.segmentId;
    const segment = segments[segmentId];
    const departureDateTime: Date = new Date(
      Date.UTC(
        segment.departureDateTime.year,
        segment.departureDateTime.month - 1,
        segment.departureDateTime.day,
        segment.departureDateTime.hour,
        segment.departureDateTime.minute
      )
    );
    const arrivalDateTime: Date = new Date(
      Date.UTC(
        segment.arrivalDateTime.year,
        segment.arrivalDateTime.month - 1,
        segment.arrivalDateTime.day,
        segment.arrivalDateTime.hour,
        segment.arrivalDateTime.minute
      )
    );
    dataProc.segments.push({
      originPlaceId: segment.originPlaceId,
      destinationPlaceId: segment.destinationPlaceId,
      departure: departureDateTime.valueOf(),
      arrival: arrivalDateTime.valueOf(),
      airlinePic: carriers[segment.operatingCarrierId].imageUrl,
    });
  }
  return dataProc;
};

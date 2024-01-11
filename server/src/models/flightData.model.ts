import { errors } from '../middleware/errorHandler.js';
import * as api from '../api/skyscanner.api.js';
import * as libApi from '../libraries/skyscanner.api.js';
import * as libFd from '../libraries/flightData.model.js';
import { Airports, Currencies } from '../databases/flightData.database.js';

export const getCurrencies = async (): Promise<string[]> => {
  //  Obtain data from database
  const dataProc: Currencies[] = await Currencies.findAll();
  //  Format output
  const dataOut: string[] = dataProc.map(currency => currency.dataValues.code);
  dataOut.sort();
  return dataOut;
};

export const getAirports = async (): Promise<Map<string, string>> => {
  //  Obtain data from database
  const dataProc: Airports[] = await Airports.findAll();
  //  Format output
  const dataOut: Map<string, string> = new Map();
  dataProc
    .sort((a, b) => a.dataValues.name.localeCompare(b.dataValues.name))
    .forEach((airport: Airports) => {
      const placeId: string = airport.dataValues.id;
      const place: string = airport.dataValues.name;
      dataOut.set(placeId, place); // reverse key-value logic
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

export const postFlightInfoRequest = async (
  requestBody: libFd.FlightInfoRequest
): Promise<libFd.FlightInfo> => {
  //  Generate date objects
  const travelDate: Date = new Date(requestBody.travelDate);
  const returnDate: Date | null =
    requestBody.returnDate !== undefined
      ? new Date(requestBody.returnDate)
      : null;
  //  Process request object to API format
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
      cabinClass: 'CABIN_CLASS_ECONOMY',
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
  //  Obtain data from API
  const dataIn: libApi.FlightsLivePrices =
    await api.postFlightsLivePricesRequest(requestBodyApi);
  if (!(dataIn instanceof Object))
    throw new errors.BadGateway('Data retrieved in unknown format.');
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

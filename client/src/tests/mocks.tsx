/**
 * @module
 * Mocks for client tests.
 * @version 1.0.0
 */

//  Internal dependencies
import * as libFd from '../libraries/flightData.service';

//  Flight data mocks
const tomorrow: number = Date.now() + 1000 * 3600 * 24;
const weekFromTomorrow: number = tomorrow + 1000 * 3600 * 24 * 7;
export const currencies: libFd.Currencies = [
  { value: 'CAD', label: 'CAD' },
  { value: 'EUR', label: 'EUR' },
  { value: 'GBP', label: 'GBP' },
  { value: 'USD', label: 'USD' },
];
export const airports: libFd.Airports = [
  { value: '95673383', label: 'Berlin Brandenburg (BER), Germany' },
  { value: '95565050', label: 'London Heathrow (LHR), United Kingdom' },
  { value: '95565041', label: 'Paris Charles de Gaulle (CDG), France' },
  { value: '95673580', label: 'Turin (TRN), Italy' },
];
export const localeInfo: libFd.LocaleInfo = {
  marketCode: 'US',
  locationName: 'United states- New York',
  currencyCode: 'USD',
  localeCode: 'en-US',
  city: 'New York'
};

// Imaginary request for following data:

export const cheapestFlightsRequest: libFd.CheapestFlightsRequest = {
  currencyCode: 'GBP',
  localeCode: 'en-US',
  marketCode: 'GB',
  originPlaceId: '95565050',
  lookAtWeeks: 2,
  travelDate: tomorrow,
};

export const cheapestFlights: libFd.CheapestFlights = {
  [String(tomorrow)]: [
    {
      vendorTherePic: 'http://test-url1.png',
      destinationPlaceId: '95673383',
      hasTransfers: false,
      price: 320,
    },
    {
      vendorTherePic: 'http://test-url2.png',
      destinationPlaceId: '95565041',
      hasTransfers: false,
      price: 365,
    },
    {
      vendorTherePic: 'http://test-url3.png',
      destinationPlaceId: '95673580',
      hasTransfers: true,
      price: 382,
    },
  ],
  [String(weekFromTomorrow)]: [
    {
      vendorTherePic: 'http://test-url4.png',
      destinationPlaceId: '95565041',
      hasTransfers: false,
      price: 345,
    },
    {
      vendorTherePic: 'http://test-url5.png',
      destinationPlaceId: '95673383',
      hasTransfers: false,
      price: 388,
    },
    {
      vendorTherePic: 'http://test-url6.png',
      destinationPlaceId: '95673580',
      hasTransfers: true,
      price: 403,
    },
  ],
};
/**
 * Imaginary request for following data:
 *
 * export const flightInfoRequest: libFd.FlightInfoRequest = {
 *   currencyCode: 'GBP',
 *   localeCode: 'en-US',
 *   marketCode: 'GB',
 *   originPlaceId: '95565050',
 *   destinationPlaceId: '95673383',
 *   travelDate: tomorrow,
 * };
 */
export const flightInfo: libFd.FlightInfo = {
  segments: [
    {
      originPlaceId: '95565050',
      destinationPlaceId: '95673383',
      departure: tomorrow + 1000 * 3600 * 4,
      arrival: tomorrow + 1000 * 3600 * 6.5,
      airlinePic: 'http://test-url.png',
    },
  ],
  vendorLink: 'http://test-link.html',
  price: 323.6,
};

export const flightData: libFd.FlightData = {
  segments: [
    {
      originPlaceId: '95673383',
      destinationPlaceId: '95565075',
      departure: 1706176500000,
      arrival: 1706182200000,
      airlinePic: '',
    },
  ],
  vendorLink:
    'https://agw.skyscnr.com/v1/redirect?pageUrl=https%3A%2F%2Fskyscanner.pxf.io%2Fc%2F2850210%2F1103265%2F13416%3Fu%3Dhttps%253A%252F%252Fwww.skyscanner.de%252Ftransport_deeplink%252F4.0%252FDE%252Fen-US%252FEUR%252Fryan%252F1%252F9828.17127.2024-01-25%252Fair%252Fairli%252Fflights%253Fitinerary%253Dflight%25257C-31915%25257C9164%25257C9828%25257C2024-01-25T09%25253A55%25257C17127%25257C2024-01-25T11%25253A30%25257C95%25257C-%25257CA%25257CBasic%2526carriers%253D-31915%2526operators%253D-30823%2526passengers%253D1%2526channel%253Ddataapi%2526cabin_class%253Deconomy%2526fps_session_id%253Da0d2f42f-995f-4c03-86c6-d8febaa59e49%2526ticket_price%253D34.72%2526is_npt%253Dfalse%2526is_multipart%253Dfalse%2526client_id%253Dskyscanner_b2b%2526request_id%253D8a1206a8-f8bb-498c-8955-0980c000716b%2526q_ids%253DH4sIAAAAAAAA_-OS5mIpqkzME2LmeOIjxcLxvJVRoeHksbVsRkwKjAA4uqfQHQAAAA%25257C7601116071123725722%25257C1%2526q_sources%253DJACQUARD%2526commercial_filters%253Dfalse%2526q_datetime_utc%253D2024-01-24T13%25253A27%25253A00%2526pqid%253Dfalse%2526api_logo%253Dhttps%25253A%25252F%25252Flogos.skyscnr.com%25252Fimages%25252Fpartners%25252Fdefault.png%2526api_pbs%253Dtrue%2526app_id%253D8CdRAjdoIPZ7vf%2525252FMr2u7vmOc2%2525252FPxu0y10PoO3nTomKERbn9Ld6H6QkxJI4f%2525252BkMMp&impactMediaPartnerId=2850210',
  price: 34.72,
};

export const destination: libFd.Option = {
  value: '95565075',
  label: 'Venice Treviso (TSF), Italy',
};

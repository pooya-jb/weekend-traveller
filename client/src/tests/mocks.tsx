import * as libFd from '../libraries/flightData.service';

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
  marketCode: 'GB',
  locationName: 'Great Britain',
  currencyCode: 'GBP',
  localeCode: 'en-US',
};
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
      vendorTherePic: '',
      destinationPlaceId: '95673383',
      hasTransfers: false,
      price: 320,
    },
    {
      vendorTherePic: '',
      destinationPlaceId: '95565041',
      hasTransfers: false,
      price: 365,
    },
    {
      vendorTherePic: '',
      destinationPlaceId: '95673580',
      hasTransfers: true,
      price: 382,
    },
  ],
  [String(weekFromTomorrow)]: [
    {
      vendorTherePic: '',
      destinationPlaceId: '95565041',
      hasTransfers: false,
      price: 345,
    },
    {
      vendorTherePic: '',
      destinationPlaceId: '95673383',
      hasTransfers: false,
      price: 388,
    },
    {
      vendorTherePic: '',
      destinationPlaceId: '95673580',
      hasTransfers: true,
      price: 403,
    },
  ],
};
export const flightInfoRequest: libFd.FlightInfoRequest = {
  currencyCode: 'GBP',
  localeCode: 'en-US',
  marketCode: 'GB',
  originPlaceId: '95565050',
  destinationPlaceId: '95673383',
  travelDate: tomorrow,
};
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

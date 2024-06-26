/**
 * @module
 * Custom type definitions for API data.
 * @version 1.0.0
 */

/**
 * Request object types
 */
export interface CheapestFlightsRequest {
  currencyCode: string;
  localeCode: string;
  marketCode: string;
  originPlaceId: string;
  lookAtWeeks: number;
  travelDate: number;
  returnDate?: number;
}
export interface FlightInfoRequest {
  currencyCode: string;
  localeCode: string;
  marketCode: string;
  originPlaceId: string;
  destinationPlaceId: string;
  travelDate: number;
  returnDate?: number;
}

/**
 * User info
 */
export interface LocaleInfo {
  marketCode: string;
  locationName: string;
  currencyCode: string;
  localeCode: string;
}

/**
 * Flight data types
 */
export interface CheapFlight {
  vendorTherePic: string;
  vendorBackPic?: string;
  destinationPlaceId: string;
  hasTransfers: boolean;
  price: number;
}
export interface CheapestFlights {
  [key: string]: CheapFlight[];
}
export interface FlightSegment {
  originPlaceId: string;
  destinationPlaceId: string;
  departure: number;
  arrival: number;
  airlinePic: string;
}
export interface FlightInfo {
  segments: FlightSegment[];
  vendorLink: string;
  price: number;
}

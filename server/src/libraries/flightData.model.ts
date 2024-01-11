export interface CheapestFlightsRequest {
  currencyCode: string;
  localeCode: string;
  marketCode: string;
  originPlaceId: string;
  lookAtWeeks: number;
  travelDate: number;
  returnDate?: number;
}

export interface LocaleInfo {
  marketCode: string;
  locationName: string;
  currencyCode: string;
  localeCode: string;
}

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

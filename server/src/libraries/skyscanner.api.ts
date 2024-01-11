/**
 * @link https://developers.skyscanner.net/api/geo
 */

export interface FlightsIndicativeRequest {
  query: {
    currency: string;
    locale: string;
    market: string;
    queryLegs: [
      {
        originPlace: {
          anywhere?: true;
          queryPlace?: {
            entityId: string;
          };
        };
        destinationPlace: {
          anywhere?: true;
          queryPlace?: {
            entityId: string;
          };
        };
        fixedDate: {
          year: number;
          month: number;
          day: number;
        };
      }
    ];
    cabinClass: string;
  };
}

export interface FlightsLivePricesRequest {
  query: {
    currency: string;
    locale: string;
    market: string;
    queryLegs: [
      {
        originPlaceId: {
          entityId: string;
        };
        destinationPlaceId: {
          entityId: string;
        };
        date: {
          year: number;
          month: number;
          day: number;
        };
      }
    ];
    cabinClass: string;
    adults: number;
  };
}

export interface RequestError {
  code: number;
  message: string;
  details: [];
}

export interface Currencies {
  status: string;
  currencies: [
    {
      code: string;
      // ...
    }
  ];
}

export interface GeoHierarchy {
  status: string;
  places: {
    [key: string]: {
      entityId: string;
      parentId: string;
      name: string;
      type: string;
      iata: string;
      // ...
    };
  };
}

export interface NearestCulture {
  status: string;
  market: {
    code: string;
    name: string;
    currency: string;
  };
  locale: {
    code: string;
    // ...
  };
  // ...
}

export interface FlightsIndicative {
  status: string;
  content: {
    results: {
      quotes: {
        [key: string]: {
          minPrice: {
            amount: string;
            unit: string;
            // ...
          };
          isDirect: boolean;
          outboundLeg: {
            destinationPlaceId: string;
            marketingCarrierId: string;
            // ...
          };
          inboundLeg: {
            marketingCarrierId: string;
            // ...
          };
        };
      };
      carriers: {
        [key: string]: {
          name: string;
          imageUrl: string;
          iata: string;
          // ...
        };
      };
      // ...
    };
    // ...
  };
}

export interface FlightsLivePrices {
  sessionToken: string;
  status: string;
  action: string;
  content: {
    results: {
      itineraries: {
        [key: string]: {
          pricingOptions: [
            {
              items: [
                {
                  price: {
                    amount: string;
                    unit: string;
                    // ...
                  };
                  deepLink: string;
                  fares: {
                    segmentId: string;
                    // ...
                  }[];
                  // ...
                }
              ];
              transferType: string;
              id: string;
              // ...
            }
          ];
          // ...
        };
      };
      segments: {
        [key: string]: {
          originPlaceId: string;
          destinationPlaceId: string;
          departureDateTime: {
            year: number;
            month: number;
            day: number;
            hour: number;
            minute: number;
            second: number;
          };
          arrivalDateTime: {
            year: number;
            month: number;
            day: number;
            hour: number;
            minute: number;
            second: number;
          };
          durationInMinutes: number;
          marketingFlightNumber: string;
          marketingCarrierId: string;
          operatingCarrierId: string;
        };
      };
      carriers: {
        [key: string]: {
          name: string;
          imageUrl: string;
          iata: string;
          // ...
        };
      };
      // ...
    };
    sortingOptions: {
      cheapest: [
        {
          score: number;
          itineraryId: string;
        }
      ];
      // ...
    };
    // ...
  };
}

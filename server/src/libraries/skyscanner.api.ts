/**
 * @link https://developers.skyscanner.net/api/
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
    includedCarriersIds: string[];
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
      // symbol: string;
      // thousandsSeparator: string;
      // decimalSeparator: string;
      // symbolOnLeft: boolean;
      // spaceBetweenAmountAndSymbol: boolean;
      // decimalDigits: number;
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
      // coordinates: {
      //   latitude: number;
      //   longitude: number;
      // };
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
    // name: string;
  };
  // currency: {
  //   code: string;
  //   symbol: string;
  //   thousandsSeparator: string;
  //   decimalSeparator: string;
  //   symbolOnLeft: boolean;
  //   spaceBetweenAmountAndSymbol: boolean;
  //   decimalDigits: number;
  // };
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
            // updateStatus: string;
          };
          isDirect: boolean;
          outboundLeg: {
            // originPlaceId: string;
            destinationPlaceId: string;
            // departureDateTime: {
            //   year: number;
            //   month: number;
            //   day: number;
            //   hour: number;
            //   minute: number;
            //   second: number;
            // };
            // quoteCreationTimestamp: string;
            marketingCarrierId: string;
          };
          inboundLeg: {
            // originPlaceId: string;
            // destinationPlaceId: string;
            // departureDateTime: {
            //   year: number;
            //   month: number;
            //   day: number;
            //   hour: number;
            //   minute: number;
            //   second: number;
            // };
            // quoteCreationTimestamp: string;
            marketingCarrierId: string;
          };
        };
      };
      carriers: {
        [key: string]: {
          name: string;
          imageUrl: string;
          iata: string;
          // icao: string;
          // displayCode: string;
        };
      };
      places: {
        [key: string]: {
          entityId: string;
          parentId: string;
          name: string;
          type: string;
          iata: string;
          // coordinates: {
          //   latitude: number;
          //   longitude: number;
          // };
        };
      };
    };
    // groupingOptions: {
    //   byRoute: {
    //     quotesGroups: [
    //       {
    //         originPlaceId: string;
    //         destinationPlaceId: string;
    //         quoteIds: string[];
    //       }
    //     ];
    //   };
    //   byDate: {
    //     quotesInboundGroups: [
    //       {
    //         monthYearDate: {
    //           year: number;
    //           month: number;
    //           day: number;
    //         };
    //         quoteIds: string[];
    //       }
    //     ];
    //     quotesOutboundGroups: [
    //       {
    //         monthYearDate: {
    //           year: number;
    //           month: number;
    //           day: number;
    //         };
    //         quoteIds: string[];
    //       }
    //     ];
    //   };
    // };
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
              price: {
                amount: string;
                unit: string;
                // updateStatus: string;
              };
              // agentIds: string[];
              items: [
                {
                  price: {};
                  agentId: string;
                  deepLink: string;
                  fares: [null];
                }
              ];
              transferType: string;
              id: string;
              // pricingOptionFare: {
              // cabinBaggage: {
              //   assessment: string;
              //   pieces: number;
              //   fee: {};
              //   weight: string;
              // };
              // checkedBaggage: {
              //   assessment: string;
              //   pieces: number;
              //   fee: {};
              //   weight: string;
              // };
              // legDetails: {
              //   [key: string]: {
              //     brandNames: [];
              //   };
              // };
              //   brandNames: string[];
              // };
            }
          ];
          legIds: string[];
          // sustainabilityData: {
          //   isEcoContender: boolean;
          //   ecoContenderDelta: number;
          // };
        };
      };
      legs: {
        [key: string]: {
          // originPlaceId: string;
          // destinationPlaceId: string;
          // departureDateTime: {
          //   year: number;
          //   month: number;
          //   day: number;
          //   hour: number;
          //   minute: number;
          //   second: number;
          // };
          // arrivalDateTime: {
          //   year: number;
          //   month: number;
          //   day: number;
          //   hour: number;
          //   minute: number;
          //   second: number;
          // };
          // durationInMinutes: number;
          // stopCount: number;
          // marketingCarrierIds: string[];
          // operatingCarrierIds: string[];
          segmentIds: string[];
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
      places: {
        [key: string]: {
          entityId: string;
          parentId: string;
          name: string;
          type: string;
          iata: string;
          // coordinates: {
          //   latitude: number;
          //   longitude: number;
          // };
        };
      };
      carriers: {
        [key: string]: {
          name: string;
          allianceId: string;
          imageUrl: string;
          iata: string;
          icao: string;
          displayCode: string;
        };
      };
      // agents: {
      //   [key: string]: {
      //     name: string;
      //     type: string;
      //     imageUrl: string;
      //     feedbackCount: number;
      //     rating: number;
      //     ratingBreakdown: {
      //       customerService: number;
      //       reliablePrices: number;
      //       clearExtraFees: number;
      //       easeOfBooking: number;
      //       other: number;
      //     };
      //     isOptimisedForMobile: boolean;
      //   };
      // };
      // alliances: {
      //   [key: string]: {
      //     name: string;
      //   };
      // };
    };
    // stats: {
    //   itineraries: {
    //     minDuration: number;
    //     maxDuration: number;
    //     total: {
    //       count: number;
    //       minPrice: {
    //         amount: string;
    //         unit: string;
    //         updateStatus: string;
    //       };
    //     };
    //     stops: {
    //       direct: {
    //         total: {
    //           count: number;
    //           minPrice: {
    //             amount: string;
    //             unit: string;
    //             updateStatus: string;
    //           };
    //         };
    //         ticketTypes: {
    //           singleTicket: {
    //             count: number;
    //             minPrice: {
    //               amount: string;
    //               unit: string;
    //               updateStatus: string;
    //             };
    //           };
    //           multiTicketNonNpt: {
    //             count: number;
    //             minPrice: {
    //               amount: string;
    //               unit: string;
    //               updateStatus: string;
    //             };
    //           };
    //           multiTicketNpt: {
    //             count: number;
    //             minPrice: {
    //               amount: string;
    //               unit: string;
    //               updateStatus: string;
    //             };
    //           };
    //         };
    //       };
    //       oneStop: {
    //         total: {
    //           count: number;
    //           minPrice: {
    //             amount: string;
    //             unit: string;
    //             updateStatus: string;
    //           };
    //         };
    //         ticketTypes: {
    //           singleTicket: {
    //             count: number;
    //             minPrice: {
    //               amount: string;
    //               unit: string;
    //               updateStatus: string;
    //             };
    //           };
    //           multiTicketNonNpt: {
    //             count: number;
    //             minPrice: {
    //               amount: string;
    //               unit: string;
    //               updateStatus: string;
    //             };
    //           };
    //           multiTicketNpt: {
    //             count: number;
    //             minPrice: {
    //               amount: string;
    //               unit: string;
    //               updateStatus: string;
    //             };
    //           };
    //         };
    //       };
    //       twoPlusStops: {
    //         total: {
    //           count: number;
    //           minPrice: {
    //             amount: string;
    //             unit: string;
    //             updateStatus: string;
    //           };
    //         };
    //         ticketTypes: {
    //           singleTicket: {
    //             count: number;
    //             minPrice: {
    //               amount: string;
    //               unit: string;
    //               updateStatus: string;
    //             };
    //           };
    //           multiTicketNonNpt: {
    //             count: number;
    //             minPrice: {
    //               amount: string;
    //               unit: string;
    //               updateStatus: string;
    //             };
    //           };
    //           multiTicketNpt: {
    //             count: number;
    //             minPrice: {
    //               amount: string;
    //               unit: string;
    //               updateStatus: string;
    //             };
    //           };
    //         };
    //       };
    //     };
    //     hasChangeAirportTransfer: boolean;
    //   };
    // };
    sortingOptions: {
      // best: [
      //   {
      //     score: number;
      //     itineraryId: string;
      //   }
      // ];
      cheapest: [
        {
          score: number;
          itineraryId: string;
        }
      ];
      // fastest: [
      //   {
      //     score: number;
      //     itineraryId: string;
      //   }
      // ];
    };
  };
}

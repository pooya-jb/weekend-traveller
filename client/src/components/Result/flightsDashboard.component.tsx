/**
 * @version 1.0.0
 */

//  External dependencies
import { useEffect, useState } from 'react';

//  Internal dependencies
import FlightsOverview from './flightsOverview';
import FlightOptions from '../Search/flightSearch.component';
import FlightsMakeSelection from './flightsMakeSelection.component';
import * as libFd from '../../libraries/flightData.service';
import { postCheapestFlightsRequest } from '../../services/flightData.service';
import FlightsLoading from './flightsLoading.component';

/**
 * @module
 * Section dedicated to searching flights.
 * Can be one of many if purpose of app grows.
 */
function FlightsDashboard() {
  //  State hooks
  const [cheapFlights, getCheapFlights] = useState<
    libFd.CheapestFlights | undefined
  >();
  const [requestBody, composeRequest] =
    useState<libFd.CheapestFlightsRequest>();

  //  Data load hooks
  useEffect(() => {
    if (requestBody) {
      getCheapFlights(undefined); // trigger loading page
      postCheapestFlightsRequest(requestBody).then((data) => {
        if (!data) {
          alert(
            `We couldn't load the flight information. ` +
              `Please try again later.`
          );
          composeRequest(undefined);
          return;
        }
        getCheapFlights(data);
      });
    }
  }, [requestBody]);

  return (
    <>
      <FlightOptions composeRequest={composeRequest} />
      <main id='dashboard' role='main'>
        {cheapFlights && requestBody ? (
          // Request made and fulfilled
          <FlightsOverview
            cheapFlights={cheapFlights}
            requestBody={requestBody}
          />
        ) : !cheapFlights && requestBody ? (
          // Request made but not yet fulfilled
          <FlightsLoading />
        ) : (
          // No request
          <FlightsMakeSelection />
        )}
      </main>
    </>
  );
}

export default FlightsDashboard;

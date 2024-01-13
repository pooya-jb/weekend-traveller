import { useEffect, useState } from 'react';

import FlightsOverview from './flightsOverview';
import FlightOptions from './flightOptions.component';
import FlightsMakeSelection from './flightsMakeSelection.component';
import * as libFd from '../libraries/flightData.service';
import { postCheapestFlightsRequest } from '../services/api.service';
import FlightsLoading from './flightsLoading.component';

function FlightsDashboard() {
  const [cheapFlights, getCheapFlights] = useState<
    libFd.CheapestFlights | undefined
  >();
  const [requestBody, composeRequest] =
    useState<libFd.CheapestFlightsRequest>();

  useEffect(() => {
    if (requestBody) {
      getCheapFlights(undefined);
      postCheapestFlightsRequest(requestBody).then(data =>
        getCheapFlights(data)
      );
    }
  }, [requestBody]);

  return (
    <>
      <FlightOptions composeRequest={composeRequest} />
      <main id="dashboard" role="main">
        {cheapFlights && requestBody ? (
          <FlightsOverview
            cheapFlights={cheapFlights}
            requestBody={requestBody}
          />
        ) : !cheapFlights && requestBody ? (
          <FlightsLoading />
        ) : (
          <FlightsMakeSelection />
        )}
      </main>
    </>
  );
}

export default FlightsDashboard;

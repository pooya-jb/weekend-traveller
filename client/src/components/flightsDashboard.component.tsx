import { useEffect, useState } from 'react';

import FlightsOverview from './flightsOverview';
import FlightOptions from './flightOptions.component';
import FlightsMakeSelection from './flightsMakeSelection.component';
import * as libFd from '../libraries/flightData.service';
import { postCheapestFlightsRequest } from '../services/api.service';

function FlightsDashboard() {
  const [cheapFlights, getCheapFlights] = useState<
    libFd.CheapestFlights | undefined
  >();
  const [requestBody, composeRequest] =
    useState<libFd.CheapestFlightsRequest>();

  useEffect(() => {
    if (requestBody) {
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
        ) : (
          <FlightsMakeSelection />
        )}
      </main>
    </>
  );
}

export default FlightsDashboard;

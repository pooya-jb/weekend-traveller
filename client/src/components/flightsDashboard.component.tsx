import { useState } from 'react';

import FlightsOverview from './flightsOverview';
import FlightOptions from './flightOptions.component';
import FlightsMakeSelection from './flightsMakeSelection.component';

function FlightsDashboard() {
  const [hasFlights, changeDashboardState] = useState(false);
  return (
    <>
      <main id="dashboard" role="main">
        <FlightOptions />
        {hasFlights ? <FlightsOverview /> : <FlightsMakeSelection />}
      </main>
    </>
  );
}

export default FlightsDashboard;

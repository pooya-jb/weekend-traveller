import moment from 'moment';

import * as libFd from '../libraries/flightData.service';
import FlightInfo from './flightInfo.component';

function FlightsOverview({
  cheapFlights,
  requestBody,
}: {
  cheapFlights: libFd.CheapestFlights;
  requestBody: libFd.CheapestFlightsRequest;
}) {
  return (
    <>
      <ul className="day-overview-columns">
        {Object.keys(cheapFlights).map(day => (
          <li key={`header.${day}`} className="flights-day-header">
            <h3>
              {moment(parseInt(day)).format('DD MMM YYYY')}
              {requestBody.returnDate
                ? ' / ' + moment(requestBody.returnDate).format('DD MMM YYYY')
                : ''}
            </h3>
          </li>
        ))}
      </ul>
      <ul className="flights-overview-columns">
        {Object.keys(cheapFlights).map(day => (
          <li key={`list.${day}`} className="flights-day-column">
            <ul className="flights-day-list">
              {cheapFlights[day].map(flight => (
                <li key={`${day}.${flight.destinationPlaceId}.${flight.price}`}>
                  <FlightInfo flightInfo={flight} requestBody={requestBody} />
                </li>
              ))}
            </ul>
          </li>
        ))}
      </ul>
    </>
  );
}

export default FlightsOverview;

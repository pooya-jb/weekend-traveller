/**
 * @version 1.0.0
 */

//  External dependencies
import moment from 'moment';

//  Internal dependencies
import * as libFd from '../../libraries/flightData.service';
import FlightInfo from './flightInfo.component';

/**
 * Date in ms with added weeks.
 * @param startDate date in ms
 * @param addWeeks whole number of weeks to offset from startDate
 * @return date in ms
 */
const getDateOffset = (
  startDate: number | string,
  addWeeks: number
): number => {
  if (typeof startDate === 'string') startDate = parseInt(startDate);
  return startDate + 1000 * 3600 * 24 * 7 * addWeeks;
};

/**
 * @module
 * Displays flight options in grid based on user's query.
 * @param cheapFlights object of sorted cheapest flights lists per day
 * @param requestBody request generating cheapFlights with additional info
 */
function FlightsOverview({
  cheapFlights,
  requestBody,
}: {
  cheapFlights: libFd.CheapestFlights;
  requestBody: libFd.CheapestFlightsRequest;
}) {
  //  Provide easy access to travel dates based on table column.
  const getTravelDate = (addWeeks: number): number =>
    getDateOffset(requestBody.travelDate, addWeeks);
  const getReturnDate = (addWeeks: number): number =>
    getDateOffset(requestBody.returnDate ?? 0, addWeeks);

  return (
    <>
      {/* Date headers */}
      <ul className='day-overview-columns'>
        {Object.keys(cheapFlights).map((dayKey, i) => (
          <li key={`header.${dayKey}`} className='flights-day-header'>
            <h3>
              {/* Show flight date */}
              {moment(getTravelDate(i)).format('DD MMM YYYY')}
              {/* Show return date if not one way */}
              {requestBody.returnDate
                ? ' / ' + moment(getReturnDate(i)).format('DD MMM YYYY')
                : ''}
            </h3>
          </li>
        ))}
      </ul>
      {/* Flight tiles */}
      <ul className='flights-overview-columns'>
        {Object.keys(cheapFlights).map((dayKey, i) => (
          <ul key={`list.${dayKey}`} className='flights-day-list'>
            {cheapFlights[dayKey].map((flight) => (
              <FlightInfo
                key={`${dayKey}.${flight.destinationPlaceId}.${flight.price}`}
                flightInfo={flight}
                requestBody={requestBody}
                flightDate={getTravelDate(i)}
                returnDate={
                  requestBody.returnDate ? getReturnDate(i) : undefined
                }
              />
            ))}
          </ul>
        ))}
      </ul>
    </>
  );
}

export default FlightsOverview;

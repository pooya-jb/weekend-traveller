import { useContext, useState } from 'react';
import DatePicker from 'react-datepicker';
import Select from 'react-select';
import { AsyncPaginate } from 'react-select-async-paginate';

import { LocaleContext } from '../App';
import * as libFd from '../libraries/flightData.service';
import * as c from '../services/const.service';
import { getAirportsPartition } from '../services/api.service';

import './reactDatePicker.css';
import './reactSelect.css';

//  TODO resolve any
async function loadOptions(search: string, loadedOptions: any) {
  return {
    options: await getAirportsPartition(100, loadedOptions.length, search),
    hasMore: true,
  };
}

function FlightOptions({
  composeRequest,
}: {
  composeRequest: (requestBody: libFd.CheapestFlightsRequest) => void;
}) {
  const [pickedAirport, pickAirport] = useState<libFd.Option>();
  const [startDate, setStartDate] = useState<Date | null>(
    c.OPTION_START_DATE_DEF
  );
  const [tripLength, setTripLength] = useState<libFd.Option>(c.OPTION_ONE_WAY);
  const [showWeeks, setShowWeeks] = useState<libFd.Option>(
    c.OPTION_SHOW_WEEKS_DEF
  );

  const localeInfo: libFd.LocaleInfo = useContext(LocaleContext);

  const searchFlights = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    // TODO error handling
    if (!pickedAirport) return;
    if (!startDate) return;
    if (startDate.valueOf() < c.OPTION_START_DATE_DEF.valueOf()) return;
    const requestBody: libFd.CheapestFlightsRequest = {
      currencyCode: localeInfo.currencyCode,
      localeCode: localeInfo.localeCode,
      marketCode: localeInfo.marketCode,
      originPlaceId: pickedAirport.value,
      lookAtWeeks: Number(showWeeks.value),
      travelDate: startDate.valueOf(),
    };
    if (tripLength.value !== c.OPTION_ONE_WAY.value) {
      requestBody.returnDate = startDate.valueOf();
      requestBody.returnDate += 1000 * 3600 * 24 * Number(tripLength.value);
    }
    composeRequest(requestBody);
  };

  return (
    <>
      <form action="submit" id="flight-options" role="flight-options">
        {/* Origin selector */}
        <div className="option-wrapper">
          <label htmlFor="flight-options-from" className="option-label">
            From:
          </label>
          <AsyncPaginate
            id="flight-options-from"
            className="option-dropdown"
            classNamePrefix="option-dropdown"
            onChange={selected => selected && pickAirport(selected)}
            loadOptions={loadOptions}
          />
        </div>
        {/* Start date selector */}
        <div className="option-wrapper">
          <label htmlFor="flight-options-from" className="option-label">
            Start date:
          </label>
          <DatePicker
            id="flight-options-start-date"
            className="option-calendar"
            selected={startDate}
            onChange={date => setStartDate(date)}
            minDate={c.OPTION_START_DATE_DEF}
          />
          <label
            htmlFor="flight-options-start-date"
            id="option-label-calendar"
            className="option-label"
          >
            &#119620;
          </label>
        </div>
        {/* Trip length selector */}
        <div className="option-wrapper">
          <label htmlFor="flight-options-return" className="option-label">
            Return:
          </label>
          <Select
            id="flight-options-return"
            className="option-dropdown"
            classNamePrefix="option-dropdown"
            defaultValue={c.OPTION_ONE_WAY}
            onChange={selected => selected && setTripLength(selected)}
            options={c.OPTIONS_TRIP_LENGTH}
          />
          {tripLength.value !== c.OPTION_ONE_WAY.value ? (
            <label className="option-label">
              {tripLength.value === '1' ? 'day' : 'days'}
            </label>
          ) : (
            ''
          )}
        </div>
        {/* Weeks to show selector */}
        <div className="option-wrapper">
          <label htmlFor="flight-options-show-x-weeks" className="option-label">
            Show:
          </label>
          <Select
            id="flight-options-show-x-weeks"
            className="option-dropdown"
            classNamePrefix="option-dropdown"
            defaultValue={c.OPTION_SHOW_WEEKS_DEF}
            onChange={selected => selected && setShowWeeks(selected)}
            options={c.OPTIONS_SHOW_WEEKS}
          />
          <label className="option-label">weeks</label>
        </div>
        {/* Search button */}
        <button
          id="flight-options-search"
          className="option-button"
          onClick={e => searchFlights(e)}
        >
          &#x1F50E;&#xFE0E;
        </button>
      </form>
    </>
  );
}

export default FlightOptions;

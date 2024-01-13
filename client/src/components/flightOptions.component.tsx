import { useContext, useState } from 'react';
import DatePicker from 'react-datepicker';
import Select from 'react-select';
import { AsyncPaginate } from 'react-select-async-paginate';

import { LocaleContext } from '../App';
import * as libFd from '../libraries/flightData.service';
import { getAirportsPartition } from '../services/api.service';

import './reactDatePicker.css';
import './reactSelect.css';

//  TODO put as global constant
const OPTION_START_DATE_DEF: Date = new Date(Date.now());
OPTION_START_DATE_DEF.setDate(OPTION_START_DATE_DEF.getDate() + 1);

const OPTIONS_SHOW_WEEKS: libFd.Option[] = [
  { value: '2', label: '2' },
  { value: '4', label: '4' },
  { value: '6', label: '6' },
  { value: '8', label: '8' },
];
const OPTION_SHOW_WEEKS_DEF: libFd.Option = OPTIONS_SHOW_WEEKS[1];

const OPTIONS_TRIP_LENGTH: libFd.Option[] = Array.from(
  { length: 29 }, // return today plus 4 weeks
  (_, i: number) => ({ value: String(i), label: String(i) })
);
const OPTION_ONE_WAY: libFd.Option = { value: '-1', label: 'One way' };
OPTIONS_TRIP_LENGTH.unshift(OPTION_ONE_WAY);

//  TODO resolve any
async function loadOptions(_: string, loadedOptions: any) {
  return {
    options: await getAirportsPartition(100, loadedOptions.length),
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
    OPTION_START_DATE_DEF
  );
  const [tripLength, setTripLength] = useState<libFd.Option>(OPTION_ONE_WAY);
  const [showWeeks, setShowWeeks] = useState<libFd.Option>(
    OPTION_SHOW_WEEKS_DEF
  );

  const localeInfo: libFd.LocaleInfo = useContext(LocaleContext);

  const searchFlights = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    // TODO error handling
    if (!pickedAirport) return;
    if (!startDate) return;
    if (startDate.valueOf() < Date.now()) return;
    const requestBody: libFd.CheapestFlightsRequest = {
      currencyCode: localeInfo.currencyCode,
      localeCode: 'en-US',
      marketCode: localeInfo.marketCode,
      originPlaceId: pickedAirport.value,
      lookAtWeeks: Number(showWeeks.value),
      travelDate: startDate.valueOf(),
    };
    if (tripLength.value !== OPTION_ONE_WAY.value) {
      requestBody.returnDate = startDate.valueOf();
      requestBody.returnDate += 1000 * 3600 * 24 * Number(tripLength);
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
            defaultValue={OPTION_ONE_WAY}
            onChange={selected => selected && setTripLength(selected)}
            options={OPTIONS_TRIP_LENGTH}
          />
          {tripLength.value !== OPTION_ONE_WAY.value ? (
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
            defaultValue={OPTION_SHOW_WEEKS_DEF}
            onChange={selected => selected && setShowWeeks(selected)}
            options={OPTIONS_SHOW_WEEKS}
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

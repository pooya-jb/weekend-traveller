import { useState } from 'react';
import DatePicker from 'react-datepicker';
import Select from 'react-select';
import { AsyncPaginate } from 'react-select-async-paginate';

import * as libFd from '../libraries/flightData.service';
import { getAirports } from '../services/api.service';

import './reactDatePicker.css';
import './reactSelect.css';

//  TODO put as global constant
const OPTION_START_DATE_DEF: Date = new Date(Date.now());

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
    options: await getAirports(100, loadedOptions.length),
    hasMore: true,
  };
}

function FlightOptions() {
  const [pickedAirport, pickAirport] = useState<libFd.Option>();
  const [startDate, setStartDate] = useState<Date | null>(
    OPTION_START_DATE_DEF
  );
  const [tripLength, setTripLength] = useState<libFd.Option>(OPTION_ONE_WAY);
  const [showWeeks, setShowWeeks] = useState<libFd.Option>(
    OPTION_SHOW_WEEKS_DEF
  );
  const [airports, setAirports] = useState<libFd.Airports>([
    { value: '', label: '' },
  ]);

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
            defaultValue={airports[0]}
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
        <button id="flight-options-search" className="option-button">
          &#x1F50E;&#xFE0E;
        </button>
      </form>
    </>
  );
}

export default FlightOptions;

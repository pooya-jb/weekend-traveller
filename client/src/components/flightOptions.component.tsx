import { useEffect, useState } from 'react';

import { getAirports } from '../services/api.service';

//  TODO put as global constant
const OPTION_ONE_WAY = { key: 'One way', value: -1 };
const OPTION_START_DATE_DEF: Date = new Date(Date.now());
const OPTION_SHOW_WEEKS_DEF: number = 4;
const OPTIONS_SHOW_WEEKS: number[] = [2, 4, 6, 8];
const OPTIONS_TRIP_LENGTH: number[] = Array.from(
  { length: 29 }, // return today plus 4 weeks
  (_, i: number) => i
);

function FlightOptions() {
  const [pickedAirport, pickAirport] = useState('');
  const [startDate, setStartDate] = useState<Date>(OPTION_START_DATE_DEF);
  const [tripLength, setTripLength] = useState<number>(OPTION_ONE_WAY.value);
  const [showWeeks, setShowWeeks] = useState<number>(OPTION_SHOW_WEEKS_DEF);
  const [airports, setAirports] = useState<[string, string][]>();

  useEffect(() => {
    getAirports().then(response => {
      setAirports(response);
    });
  }, []);

  return (
    <>
      <form action="submit" id="flight-options" role="flight-options">
        {/* Origin selector */}
        <div className="option-wrapper">
          <label htmlFor="flight-options-from" className="option-label">
            From:
          </label>
          <select
            id="flight-options-from"
            className="option-dropdown"
            onChange={e => pickAirport(e.target.value)}
          >
            {airports?.map(airport => (
              <option value={airport[0]} className="option-item">
                {airport[1]}
              </option>
            ))}
          </select>
        </div>
        {/* Start date selector */}
        <div className="option-wrapper">
          <label htmlFor="flight-options-start-date" className="option-label">
            Search from:
          </label>
          <select id="flight-options-start-date" className="option-dropdown">
            ####
          </select>
        </div>
        {/* Trip length selector */}
        <div className="option-wrapper">
          <label htmlFor="flight-options-return" className="option-label">
            Return:
          </label>
          <select
            id="flight-options-return"
            className="option-dropdown"
            onChange={e => setTripLength(parseInt(e.target.value))}
            defaultValue={OPTION_ONE_WAY.value}
          >
            <option
              key={OPTION_ONE_WAY.value}
              value={OPTION_ONE_WAY.value}
              className="option-item"
            >
              {OPTION_ONE_WAY.key}
            </option>
            {OPTIONS_TRIP_LENGTH.map(option => (
              <option key={option} value={option} className="option-item">
                {option}
              </option>
            ))}
          </select>
          {tripLength !== OPTION_ONE_WAY.value ? (
            <label className="option-label">days</label>
          ) : (
            ''
          )}
        </div>
        {/* Weeks to show selector */}
        <div className="option-wrapper">
          <label htmlFor="flight-options-show-x-weeks" className="option-label">
            Show:
          </label>
          <select
            id="flight-options-show-x-weeks"
            className="option-dropdown"
            onChange={e => setShowWeeks(parseInt(e.target.value))}
            defaultValue={OPTION_SHOW_WEEKS_DEF}
          >
            {OPTIONS_SHOW_WEEKS.map(option => (
              <option key={option} value={option} className="option-item">
                {option}
              </option>
            ))}
          </select>
          <label className="option-label">weeks</label>
        </div>
        {/* Search button */}
        <div className="option-wrapper">
          <button id="flight-options-search" className="option-button">
            &#x1F50E;&#xFE0E;
          </button>
        </div>
      </form>
    </>
  );
}

export default FlightOptions;

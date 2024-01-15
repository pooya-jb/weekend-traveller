/**
 * @module
 * Global storage for public constants.
 * All objects must be frozen to ensure immutability.
 * Import module as 'c' (for convenience).
 * @version 1.0.0
 */

//  Internal dependencies
import * as libFd from '../libraries/flightData.service';

/**
 * API connection constants
 * @constant SERVER_URL address of your webserver
 * @constant IP_REQUEST_URL used for Locale Info request which requires user IP
 */
export const SERVER_URL: string = `http://localhost:3000`;
export const IP_REQUEST_URL: string = `https://api.ipify.org?format=json`;

/**
 * Request options
 * @constant GLOBAL_LOCALE decided to ignore user's locale due to time constraint
 * @constant OPTIONS_SHOW_WEEKS weeks to display, value MUST be a number
 * @constant OPTIONS_TRIP_LENGTH defines return date, value MUST be a number
 * @constant OPTION_SHOW_WEEKS_DEF default on initial load
 * @constant OPTION_START_DATE_DEF tomorrow, default on initial load
 * @constant OPTION_ONE_WAY no-return search, default on initial load
 */
export const GLOBAL_LOCALE: string = 'en-US';

export const OPTIONS_SHOW_WEEKS: libFd.Option[] = [
  { value: '2', label: '2' },
  { value: '4', label: '4' },
  { value: '6', label: '6' },
  { value: '8', label: '8' },
];

export const OPTIONS_TRIP_LENGTH: libFd.Option[] = Array.from(
  { length: 29 }, // return today plus 4 weeks
  (_, i: number) => ({ value: String(i), label: String(i) })
);

export const OPTION_SHOW_WEEKS_DEF: libFd.Option = OPTIONS_SHOW_WEEKS[1];

export const OPTION_START_DATE_DEF: Date = new Date(Date.now());
OPTION_START_DATE_DEF.setDate(OPTION_START_DATE_DEF.getDate() + 1);

export const OPTION_ONE_WAY: libFd.Option = { value: '-1', label: 'One way' };
OPTIONS_TRIP_LENGTH.unshift(OPTION_ONE_WAY);

//  Freeze objects!
Object.freeze(OPTIONS_SHOW_WEEKS);
Object.freeze(OPTIONS_TRIP_LENGTH);
Object.freeze(OPTION_SHOW_WEEKS_DEF);
Object.freeze(OPTION_START_DATE_DEF);
Object.freeze(OPTION_ONE_WAY);

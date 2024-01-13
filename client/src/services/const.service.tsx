import * as libFd from '../libraries/flightData.service';

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

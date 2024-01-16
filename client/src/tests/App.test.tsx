import { act, fireEvent, render, screen } from '@testing-library/react';
import { MockInstance, vi } from 'vitest';

import App from '../App';
import * as mocks from './mocks';
import * as c from '../services/const.service';
import moment from 'moment';

const KEY_DOWN_ARROW: number = 40;

const getFirstInput = (holdingElement: HTMLElement) => {
  const inputCollection = holdingElement.getElementsByTagName('input');
  expect(inputCollection.length).toBeGreaterThanOrEqual(1);
  return inputCollection[0];
};

vi.mock('../services/flightData.service', () => {
  return {
    getCurrencies: vi.fn(() => {
      return Promise.resolve(mocks.currencies);
    }),
    getAirports: vi.fn(() => {
      return Promise.resolve(mocks.airports);
    }),
    postLocaleInfoRequest: vi.fn(() => {
      return Promise.resolve(mocks.localeInfo);
    }),
    postCheapestFlightsRequest: vi.fn(() => {
      return Promise.resolve(mocks.cheapestFlights);
    }),
    postFlightInfoRequest: vi.fn(() => {
      return Promise.resolve(mocks.flightInfo);
    }),
  };
});

beforeEach(async () => {
  await act(async () => render(<App />));
});

describe('App component', () => {
  it('should render App with header, main area and footer', async () => {
    const header = screen.getByRole('header');
    expect(header).toBeInTheDocument();
    const main = screen.getByRole('main');
    expect(main).toBeInTheDocument();
    const footer = screen.getByRole('footer');
    expect(footer).toBeInTheDocument();
  });

  it('should render the Welcome message', async () => {
    const welcome = screen.getByText('Welcome to Weekend Traveller');
    expect(welcome).toBeInTheDocument();
  });
});

describe('Header component', () => {
  let logo: HTMLElement;
  let locationLabel: HTMLElement;
  let location: HTMLElement;
  let currencyLabel: HTMLElement;
  let currency: HTMLElement;
  beforeEach(() => {
    logo = screen.getByRole('heading', { level: 1 });
    locationLabel = screen.getByText('Your location:');
    location = locationLabel.nextSibling as HTMLElement;
    currencyLabel = screen.getByText('Currency:');
    currency = currencyLabel.nextSibling as HTMLElement;
  });

  it('should render page name in H1 element', async () => {
    expect(logo).toHaveTextContent('Weekend Traveller');
  });

  it('should render current location of user', async () => {
    expect(locationLabel).toBeInTheDocument();
    expect(location).toBeInTheDocument();
    expect(location).toHaveTextContent(mocks.localeInfo.locationName);
  });

  it('should render currency dropdown with local currency of user', async () => {
    expect(currencyLabel).toBeInTheDocument();
    expect(currency).toBeInTheDocument();
    expect(currency).toHaveTextContent(mocks.localeInfo.currencyCode);
  });

  it('should render all currency options on interaction', async () => {
    await fireEvent.keyDown(currency, { keyCode: KEY_DOWN_ARROW });
    mocks.currencies.forEach(currencyIt =>
      expect(currency).toHaveTextContent(currencyIt.label)
    );
  });

  it('should show selected currency in dropdown on click', async () => {
    await fireEvent.keyDown(currency, { keyCode: KEY_DOWN_ARROW });
    const option0 = screen.getByText(mocks.currencies[0].label); // CAD
    await fireEvent.click(option0);
    expect(currency?.textContent).toEqual(mocks.currencies[0].label);
  });
});

describe('Flight options component', () => {
  let airportsLabel: HTMLElement;
  let airports: HTMLElement;
  let airportsInput: HTMLElement;
  let startDateLabel: HTMLElement;
  let startDate: HTMLElement;
  let startDateInput: HTMLElement;
  let tripLengthLabel: HTMLElement;
  let tripLength: HTMLElement;
  let showWeeksLabel: HTMLElement;
  let showWeeks: HTMLElement;
  let searchButton: HTMLElement;
  let alertMock: MockInstance;
  beforeEach(() => {
    airportsLabel = screen.getByText('From:');
    airports = airportsLabel.nextSibling as HTMLElement;
    airportsInput = getFirstInput(airports);
    startDateLabel = screen.getByText('Start date:');
    startDate = startDateLabel.nextSibling as HTMLElement;
    startDateInput = getFirstInput(startDate);
    tripLengthLabel = screen.getByText('Return:');
    tripLength = tripLengthLabel.nextSibling as HTMLElement;
    showWeeksLabel = screen.getByText('Show:');
    showWeeks = showWeeksLabel.nextSibling as HTMLElement;
    searchButton = screen.getByText('🔎︎');
    alertMock = vi.spyOn(window, 'alert').mockImplementation(() => {});
  });

  //  Airport selection

  it('should render empty airports dropdown', async () => {
    expect(airportsLabel).toBeInTheDocument();
    expect(airports).toBeInTheDocument();
    expect(airportsInput).toBeInTheDocument();
    expect(airports).toHaveTextContent('Select...');
  });

  it('should render all airport options on interaction', async () => {
    await act(() => fireEvent.keyDown(airports, { keyCode: KEY_DOWN_ARROW }));
    mocks.airports.forEach(airport =>
      expect(airports).toHaveTextContent(airport.label)
    );
  });

  it('should show selected airport in dropdown on click', async () => {
    await act(() => fireEvent.keyDown(airports, { keyCode: KEY_DOWN_ARROW }));
    const option0 = screen.getByText(mocks.airports[0].label); // Berlin
    await fireEvent.click(option0);
    expect(airports?.textContent).toEqual(mocks.airports[0].label);
  });

  it('should search airports', async () => {
    await act(() => fireEvent.keyDown(airports, { keyCode: KEY_DOWN_ARROW }));
    await act(() =>
      fireEvent.change(airportsInput, {
        target: { value: mocks.airports[0].label },
      })
    );
    const option0 = screen.getByText(mocks.airports[0].label); // Berlin
    await fireEvent.click(option0);
    expect(airports?.textContent).toEqual(mocks.airports[0].label);
  });

  //  Start date selection

  it("should render start date with tomorrow's date preselected", async () => {
    expect(startDateLabel).toBeInTheDocument();
    expect(startDate).toBeInTheDocument();
    expect(startDateInput).toBeInTheDocument();
    const startDateDef = moment(c.OPTION_START_DATE_DEF).format('MM/DD/YYYY');
    expect(startDateInput).toHaveValue(startDateDef);
  });

  it('should render calendar datepicker on interaction', async () => {
    await act(async () => await fireEvent.click(startDateInput));
    const startMonthDef = moment(c.OPTION_START_DATE_DEF).format('MMMM YYYY');
    const calendarHeader = screen.getByText(startMonthDef);
    expect(calendarHeader).toBeInTheDocument();
  });

  it('should allow selecting future date', async () => {
    const startDateNew = moment(c.OPTION_START_DATE_DEF).add(1, 'day');
    await act(async () => await fireEvent.click(startDateInput));
    const nextDay = screen.getByRole('option', {
      name: `Choose ${startDateNew.format('dddd, MMMM Do, YYYY')}`,
    });
    await act(async () => await fireEvent.click(nextDay));
    expect(startDateInput).toHaveValue(startDateNew.format('MM/DD/YYYY'));
  });

  it('should not allow selecting past date', async () => {
    const startDateNew = moment(c.OPTION_START_DATE_DEF).add(-1, 'day');
    await act(async () => await fireEvent.click(startDateInput));
    const previousDay = screen.getByRole('option', {
      name: `Not available ${startDateNew.format('dddd, MMMM Do, YYYY')}`,
    });
    await act(async () => await fireEvent.click(previousDay));
    expect(startDateInput).not.toHaveValue(startDateNew.format('MM/DD/YYYY'));
  });

  //  Trip length selection

  it('should render trip length dropdown with "One way" preselected', async () => {
    expect(tripLengthLabel).toBeInTheDocument();
    expect(tripLength).toBeInTheDocument();
    expect(tripLength).toHaveTextContent(c.OPTION_ONE_WAY.label);
  });

  it('should render all trip length options on interaction', async () => {
    await act(() => fireEvent.keyDown(tripLength, { keyCode: KEY_DOWN_ARROW }));
    c.OPTIONS_TRIP_LENGTH.forEach(option =>
      expect(tripLength).toHaveTextContent(option.label)
    );
  });

  it('should show selected trip length in dropdown on click', async () => {
    //  Test selecting 2 days
    await act(() => fireEvent.keyDown(tripLength, { keyCode: KEY_DOWN_ARROW }));
    const option3 = screen.getByText(c.OPTIONS_TRIP_LENGTH[3].label); // 2
    await fireEvent.click(option3);
    expect(tripLength?.textContent).toEqual(c.OPTIONS_TRIP_LENGTH[3].label);
    const tripLengthUnit = screen.getByText('days');
    expect(tripLengthUnit).toBeInTheDocument();

    //  Test selecting One way again
    await act(() => fireEvent.keyDown(tripLength, { keyCode: KEY_DOWN_ARROW }));
    const option0 = screen.getByText(c.OPTIONS_TRIP_LENGTH[0].label); // One way
    await fireEvent.click(option0);
    expect(tripLength?.textContent).toEqual(c.OPTIONS_TRIP_LENGTH[0].label);
    expect(tripLengthUnit).not.toBeInTheDocument();
  });

  //  Show X weeks selection

  it('should render show dropdown with default option preselected', async () => {
    expect(showWeeksLabel).toBeInTheDocument();
    expect(showWeeks).toBeInTheDocument();
    expect(showWeeks).toHaveTextContent(c.OPTION_SHOW_WEEKS_DEF.label);
  });

  it('should render all show options on interaction', async () => {
    await act(() => fireEvent.keyDown(showWeeks, { keyCode: KEY_DOWN_ARROW }));
    c.OPTIONS_SHOW_WEEKS.forEach(option =>
      expect(showWeeks).toHaveTextContent(option.label)
    );
  });

  it('should show selected show option in dropdown on click', async () => {
    await act(() => fireEvent.keyDown(showWeeks, { keyCode: KEY_DOWN_ARROW }));
    const option3 = screen.getByText(c.OPTIONS_SHOW_WEEKS[3].label); // 8
    await fireEvent.click(option3);
    expect(showWeeks?.textContent).toEqual(c.OPTIONS_SHOW_WEEKS[3].label);
  });

  //  Search button

  it('should render search button 🔎︎', async () => {
    expect(searchButton).toBeInTheDocument();
  });

  it('should not allow search while options are not complete', async () => {
    await act(() => fireEvent.click(searchButton));
    expect(alertMock).toHaveBeenCalledTimes(1);
  });
});

// describe('Flight overview component', () => {
//   it('should allow search when options are selected', async () => {
//     await act(() => fireEvent.keyDown(airports, { keyCode: KEY_DOWN_ARROW }));
//     const airport1 = screen.getByText(mocks.airports[1].label); // Heathrow
//     await fireEvent.click(airport1);
//     await act(() => fireEvent.keyDown(showWeeks, { keyCode: KEY_DOWN_ARROW }));
//     const showWeeks0 = screen.getByText(c.OPTIONS_SHOW_WEEKS[0].label); // 2
//     await fireEvent.click(showWeeks0);
//   });
// });

//  TESTS TO BE MADE
//  9.  Shows results:
//        X number of weeks
//        Travel date and return date
//        Destination
//        Price in correct format

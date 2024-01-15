import { act, fireEvent, render, screen } from '@testing-library/react';
import { vi } from 'vitest';

import App from '../App';
import * as mocks from './mocks';
import { before } from 'node:test';

const KEY_DOWN_ARROW: number = 40;

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
});

describe('Header component', () => {
  let logo: HTMLElement;
  let locationLabel: HTMLElement;
  let locationName: HTMLElement;
  let currencyLabel: HTMLElement;
  let currencyDropdown: HTMLElement;
  beforeEach(() => {
    logo = screen.getByRole('heading', { level: 1 });
    locationLabel = screen.getByText('Your location:');
    locationName = locationLabel.nextSibling as HTMLElement;
    currencyLabel = screen.getByText('Currency:');
    currencyDropdown = currencyLabel.nextSibling as HTMLElement;
  });

  it('should render page name in H1 element', async () => {
    expect(logo).toHaveTextContent('Weekend Traveller');
  });

  it('should render current location of user', async () => {
    expect(locationLabel).toBeInTheDocument();
    expect(locationName).toBeInTheDocument();
    expect(locationName).toHaveTextContent(mocks.localeInfo.locationName);
  });

  it('should render currency dropdown with local currency of user', async () => {
    expect(currencyLabel).toBeInTheDocument();
    expect(currencyDropdown).toBeInTheDocument();
    expect(currencyDropdown).toHaveTextContent(mocks.localeInfo.currencyCode);
  });

  it('should show all currency options on interaction', async () => {
    await fireEvent.keyDown(currencyDropdown, { keyCode: KEY_DOWN_ARROW });
    mocks.currencies.forEach(currency =>
      expect(currencyDropdown).toHaveTextContent(currency.label)
    );
  });

  it('should show selected currency in dropdown on click', async () => {
    await fireEvent.keyDown(currencyDropdown, { keyCode: KEY_DOWN_ARROW });
    const optionCAD = screen.getByText(mocks.currencies[0].label);
    await fireEvent.click(optionCAD);
    expect(currencyDropdown?.textContent).toEqual(mocks.currencies[0].label);
  });
});

// describe('Flight options component', () => {});

//  TESTS TO BE MADE
//  3.  Allows airport selection
//  4.  Allows airport search
//  5.  Allows date selection; doesnt allow prev date selection
//  6.  Allows one way selection
//  7.  Allows Return trip
//  8.  Allows weeks-to-show selection
//      Doesnt allow search if any option is invalid
//  9.  Shows results:
//        X number of weeks
//        Travel date and return date
//        Destination
//        Price in correct format

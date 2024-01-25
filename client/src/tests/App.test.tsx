/**
 * @module
 * Test suite for Weekend Traveller app.
 * Covers both units and integration.
 * @version 1.0.0
 */

//  External dependencies
import { act, fireEvent, render, screen } from '@testing-library/react';
import { MockInstance, vi } from 'vitest';

//  Internal dependencies
import App from '../App';
import * as mocks from './mocks';
import * as c from '../services/const.service';
import moment from 'moment';

//  Key code constants
const KEY_DOWN_ARROW: number = 40;

//  Flight data API mocks
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

/**
 * Locates first input HTML element within holdingElement.
 * Is needed to include external components in tests
 * which don't provide easy access to their internals via usual test approaches.
 * @param holdingElement within it input(s) will be searched
 * @returns first input element found
 */
// const getFirstInput = (holdingElement: HTMLElement) => {
//   const inputCollection = holdingElement.getElementsByTagName('input');
//   expect(inputCollection.length).toBeGreaterThanOrEqual(1);
//   return inputCollection[0];
// };

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



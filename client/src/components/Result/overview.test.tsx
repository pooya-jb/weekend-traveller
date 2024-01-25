//  External dependencies
import { act, fireEvent, render, screen } from '@testing-library/react';
import { MockInstance, vi } from 'vitest';

//  Internal dependencies
import * as mocks from '../../tests/mocks';
import * as c from '../../services/const.service';
import moment from 'moment';
import FlightsOverview
 from './flightsOverview';
//  Key code constants
const KEY_DOWN_ARROW: number = 40;

beforeEach(async () => {
  await act(async () => render(<FlightsOverview cheapFlights={mocks.cheapestFlights} requestBody={mocks.cheapestFlightsRequest} />));
});

describe('Flight overview component', () => {
  let airportsLabel: HTMLElement;
  let airports: HTMLElement;
  let showWeeksLabel: HTMLElement;
  let showWeeks: HTMLElement;
  let searchButton: HTMLElement;
  let alertMock: MockInstance;
  beforeEach(() => {
    airportsLabel = screen.getByText('From:');
    airports = airportsLabel.nextSibling as HTMLElement;
    showWeeksLabel = screen.getByText('Show:');
    showWeeks = showWeeksLabel.nextSibling as HTMLElement;
    searchButton = screen.getByText('🔎︎');
    alertMock = vi.spyOn(window, 'alert').mockImplementation(() => {});
  });

  it('should show query results on search', async () => {
    //  Check for homepage
    const welcome = screen.getByText('Welcome to Weekend Traveller');
    expect(welcome).toBeInTheDocument();

    //  Complete flight search
    await act(() => fireEvent.keyDown(airports, { keyCode: KEY_DOWN_ARROW }));
    const airport1 = screen.getByText(mocks.airports[1].label); // Heathrow
    await fireEvent.click(airport1);
    await act(() => fireEvent.keyDown(showWeeks, { keyCode: KEY_DOWN_ARROW }));
    const showWeeks0 = screen.getByText(c.OPTIONS_SHOW_WEEKS[0].label); // 2
    await fireEvent.click(showWeeks0);
    await act(() => fireEvent.click(searchButton));
    expect(alertMock).toHaveBeenCalledTimes(0);
    expect(welcome).not.toBeInTheDocument();

    //  Check displayed data
    for (let [day, flights] of Object.entries(mocks.cheapestFlights)) {
      const dayFormat = moment(parseInt(day)).format('DD MMM YYYY');
      const dayHeader = screen.getByText(dayFormat);
      expect(dayHeader).toBeInTheDocument();
      for (let flight of flights) {
        //  Compose flight info
        const destination =
          mocks.airports.find(
            (airport) => flight.destinationPlaceId === airport.value
          )?.label ?? 'not found';
        const transfer = flight.hasTransfers ? 'Transfer' : '';
        const price = flight.price.toLocaleString(mocks.localeInfo.localeCode, {
          style: 'currency',
          currency: mocks.localeInfo.currencyCode,
        });

        //  Search for tile with matching information
        const tiles = screen.getAllByText(destination);
        let tileFound: boolean = false;
        for (let tile of tiles) {
          if (
            tile.parentElement?.textContent ===
            destination + transfer + price
          ) {
            tileFound = true;
            break;
          }
        }
        expect(tileFound).toBeTruthy();
      }
    }
  });
});

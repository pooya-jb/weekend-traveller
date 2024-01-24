//  External dependencies
import { act, fireEvent, render, screen } from '@testing-library/react';
import { MockInstance, vi } from 'vitest';

//  Internal dependencies
import App from '../../App';
import * as mocks from '../../tests/mocks';
import * as c from '../../services/const.service';
import moment from 'moment';

//  Key code constants
const KEY_DOWN_ARROW: number = 40;

beforeEach(async () => {
  await act(async () => render(<App />));
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
    mocks.currencies.forEach((currencyIt) =>
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

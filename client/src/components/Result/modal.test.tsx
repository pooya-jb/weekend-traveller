//  External dependencies
import { act, fireEvent, render, screen } from '@testing-library/react';
import { MockInstance, vi } from 'vitest';

//  Internal dependencies
import * as mocks from '../../tests/mocks';
import * as c from '../../services/const.service';
import moment from 'moment';
import Modal from './modal.component';

beforeEach(async () => {
  await act(async () =>
    render(
      <Modal
        flightData={mocks.flightData}
        destination={mocks.destination}
        setIsModalOpen={vi.fn()}
      />
    )
  );
});

describe('Modal Component', () => {
  let header: HTMLElement;
  let price: string | undefined;
  let buyBtn: string | null;

  beforeEach(() => {
    header = screen.getByRole('heading', { level: 2 });
    price = document.getElementById('flight-price')?.innerHTML;
    buyBtn = screen.getByText('Buy now!').getAttribute('href');
  });

  it('renders header', async () => {
    expect(header).toBeInTheDocument();
  });

  it('checks the price', async () => {
    expect(price).toBe(`Total price: ${mocks.flightData.price}`);
  });

  it('checks that buy button has correct link!', async () => {
    expect(buyBtn).toBe(mocks.flightData.vendorLink);
  });
});

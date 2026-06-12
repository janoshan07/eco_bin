import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import PaymentOption from './PaymentOption';

const renderComponent = (state) => {
  return render(
    <MemoryRouter initialEntries={[{ pathname: '/addcardpayment', state }]}>
      <PaymentOption />
    </MemoryRouter>
  );
};

describe('PaymentOption Component', () => {
  beforeEach(() => {
    jest.spyOn(global, 'fetch').mockImplementation(() =>
      Promise.resolve({
        json: () => Promise.resolve({ message: 'Payment added successfully' }),
      })
    );
    window.alert = jest.fn();
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  test('displays payment options and total amount correctly', () => {
    const state = { amount: 1000 };
    renderComponent(state);

    expect(screen.getByText(/Select Payment Option/i)).toBeInTheDocument();
    expect(screen.getByText(/Rs. 1000.00/i)).toBeInTheDocument();
  });

  test('successfully submits online payment with card details', async () => {
    const state = { amount: 1000 };
    renderComponent(state);

    fireEvent.click(screen.getByText(/Online Card Payment/i));
    fireEvent.change(screen.getByPlaceholderText(/12-digit Card Number/i), { target: { value: '123456781234' } }); // 12 digits required
    fireEvent.change(screen.getByPlaceholderText(/MM\/YYYY/i), { target: { value: '12/2025' } });
    fireEvent.change(screen.getByPlaceholderText(/3 Digits/i), { target: { value: '123' } });
    fireEvent.click(screen.getByRole('button', { name: /Complete Payment/i }));

    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalledTimes(1);
      expect(window.alert).toHaveBeenCalledWith("Payment added successfully");
    });
  });
});

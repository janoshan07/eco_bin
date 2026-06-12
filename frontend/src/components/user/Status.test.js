import React from 'react';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import '@testing-library/jest-dom';
import Status from './Status';

const renderComponent = (state) => {
  return render(
    <MemoryRouter initialEntries={[{ pathname: '/status', state }]}>
      <Status />
    </MemoryRouter>
  );
};

describe('Status Component', () => {
  test('displays payment status details correctly', () => {
    const state = { paymentMethod: 'online', paymentStatus: 'completed', amount: 1000 };
    renderComponent(state);

    expect(screen.getByText(/Collection Scheduled Successfully!/i)).toBeInTheDocument();
    expect(screen.getByText(/Payment Method:/i)).toBeInTheDocument();
    expect(screen.getByText(/online/i)).toBeInTheDocument();
    expect(screen.getByText(/completed/i)).toBeInTheDocument();
    expect(screen.getByText(/Rs. 1000.00/i)).toBeInTheDocument();
  });

  test('displays default values for missing details', () => {
    renderComponent({});

    // It should display N/A for missing details
    const elements = screen.getAllByText(/N\/A/i);
    expect(elements.length).toBeGreaterThan(0);
    expect(screen.getByText(/Rs. 0.00/i)).toBeInTheDocument();
  });
});

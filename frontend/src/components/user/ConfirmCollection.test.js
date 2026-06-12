import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import axios from 'axios';
import MockAdapter from 'axios-mock-adapter';
import ConfirmCollection from './ConfirmCollection';

const mockAxios = new MockAdapter(axios);

const renderComponent = (state) => {
  return render(
    <MemoryRouter initialEntries={[{ pathname: '/confirm', state }]}>
      <ConfirmCollection />
    </MemoryRouter>
  );
};

describe('ConfirmCollection Component', () => {
  afterEach(() => {
    mockAxios.reset(); // Reset the mock adapter after each test
  });

  test('displays collection details correctly', () => {
    const state = { scheduleId: '123', address: '123 Main St', district: 'Colombo', dateTime: '2024-10-09T10:00:00Z' };
    renderComponent(state);

    expect(screen.getByText(/Confirm Your Collection Details/i)).toBeInTheDocument();
    expect(screen.getByText(/Address/i)).toBeInTheDocument();
    expect(screen.getByText(/123 Main St/i)).toBeInTheDocument();
    expect(screen.getByText(/District/i)).toBeInTheDocument();
    expect(screen.getByText(/Colombo/i)).toBeInTheDocument();
    expect(screen.getByText(/Date/i)).toBeInTheDocument();
    expect(screen.getByText(/Time/i)).toBeInTheDocument();
  });

  test('successfully deletes schedule and navigates', async () => {
    const state = { scheduleId: '123', address: '123 Main St', district: 'Colombo', dateTime: '2024-10-09T10:00:00Z' };
    mockAxios.onDelete('http://localhost:8070/schedule/deleteschedule/123').reply(200);

    renderComponent(state);

    // Mock window alert and confirm
    window.alert = jest.fn();
    window.confirm = jest.fn(() => true);

    fireEvent.click(screen.getByRole('button', { name: /cancel slot/i }));

    expect(window.confirm).toHaveBeenCalledWith("Are you sure you want to cancel this scheduled pickup slot?");
    // Let's wait for async execution
    await screen.findByText(/Confirm Your Collection Details/i);
    expect(window.alert).toHaveBeenCalledWith("Schedule deleted successfully!");
    expect(mockAxios.history.delete.length).toBe(1); // Ensure DELETE request was made
  });

  test('handles delete error correctly', async () => {
    const state = { scheduleId: '123', address: '123 Main St', district: 'Colombo', dateTime: '2024-10-09T10:00:00Z' };
    mockAxios.onDelete('http://localhost:8070/schedule/deleteschedule/123').reply(500);

    renderComponent(state);

    // Mock window alert and confirm
    window.alert = jest.fn();
    window.confirm = jest.fn(() => true);

    fireEvent.click(screen.getByRole('button', { name: /cancel slot/i }));

    await screen.findByText(/Confirm Your Collection Details/i);
    expect(window.alert).toHaveBeenCalledWith("Failed to delete schedule. Please try again.");
  });

  test('navigates to update schedule page with correct data', () => {
    const state = { scheduleId: '123', address: '123 Main St', district: 'Colombo', dateTime: '2024-10-09T10:00:00Z' };
    renderComponent(state);

    expect(screen.getByRole('button', { name: /edit details/i })).toBeInTheDocument();
  });
});

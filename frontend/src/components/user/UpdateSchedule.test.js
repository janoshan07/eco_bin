import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import UpdateSchedule from './UpdateSchedule';
import axios from 'axios';

// Mocking the axios module
jest.mock('axios');

const renderComponent = (state) => {
  return render(
    <MemoryRouter initialEntries={[{ pathname: '/update-schedule/123', state }]}>
      <UpdateSchedule />
    </MemoryRouter>
  );
};

describe('UpdateSchedule Component', () => {
  const initialState = {
    scheduleId: '123',
    address: '123 Main St',
    district: 'Colombo',
    dateTime: '2024-10-15T10:00',
  };

  test('renders form with initial values', () => {
    renderComponent(initialState);

    expect(screen.getByLabelText(/address/i)).toHaveValue(initialState.address);
    expect(screen.getByLabelText(/district/i)).toHaveValue(initialState.district);
    expect(screen.getByLabelText(/date and time/i)).toHaveValue(initialState.dateTime);
  });

  test('updates schedule successfully', async () => {
    axios.put.mockResolvedValueOnce({ data: { message: 'Schedule updated successfully!' } });
    
    renderComponent(initialState);

    // Mock window alert
    window.alert = jest.fn();

    fireEvent.change(screen.getByLabelText(/address/i), { target: { value: '456 Another St' } });
    fireEvent.change(screen.getByLabelText(/district/i), { target: { value: 'Gampaha' } });
    fireEvent.change(screen.getByLabelText(/date and time/i), { target: { value: '2024-10-16T11:00' } });

    fireEvent.click(screen.getByRole('button', { name: /save changes/i }));

    await waitFor(() => {
      expect(axios.put).toHaveBeenCalledWith(`http://localhost:8070/schedule/updateschedule/${initialState.scheduleId}`, {
        address: '456 Another St',
        district: 'Gampaha',
        dateTime: '2024-10-16T11:00',
      });
      expect(window.alert).toHaveBeenCalledWith("Schedule updated successfully!");
    });
  });

  test('displays error message on update failure', async () => {
    axios.put.mockRejectedValueOnce(new Error('Failed to update schedule'));
    
    renderComponent(initialState);

    // Mock window alert
    window.alert = jest.fn();

    fireEvent.click(screen.getByRole('button', { name: /save changes/i }));

    await waitFor(() => {
      expect(window.alert).toHaveBeenCalledWith("Failed to update schedule. Please try again.");
    });
  });
});

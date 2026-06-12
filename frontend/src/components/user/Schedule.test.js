import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import Schedule from './Schedule';
import { BrowserRouter } from 'react-router-dom';

const renderComponent = () => {
  return render(
    <BrowserRouter>
      <Schedule />
    </BrowserRouter>
  );
};

describe('Schedule Component', () => {
  test('renders form fields correctly', () => {
    renderComponent();
    expect(screen.getByLabelText(/address/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/district/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/date and time slot/i)).toBeInTheDocument();
  });

  test('form inputs are required', () => {
    renderComponent();
    expect(screen.getByLabelText(/address/i)).toBeRequired();
    expect(screen.getByLabelText(/district/i)).toBeRequired();
    expect(screen.getByLabelText(/date and time slot/i)).toBeRequired();
  });
});

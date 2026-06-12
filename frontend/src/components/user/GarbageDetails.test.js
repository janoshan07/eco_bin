import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import GarbageDetails from './GarbageDetails';
import { BrowserRouter } from 'react-router-dom';

const renderComponent = () => {
  return render(
    <BrowserRouter>
      <GarbageDetails />
    </BrowserRouter>
  );
};

describe('GarbageDetails Component', () => {
  test('renders form fields correctly', () => {
    renderComponent();
    expect(screen.getByLabelText(/name/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/contact number/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/waste type/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/weight/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/additional notes/i)).toBeInTheDocument();
  });

  test('form inputs are required', () => {
    renderComponent();
    expect(screen.getByLabelText(/name/i)).toBeRequired();
    expect(screen.getByLabelText(/contact number/i)).toBeRequired();
    expect(screen.getByLabelText(/waste type/i)).toBeRequired();
    expect(screen.getByLabelText(/weight/i)).toBeRequired();
    expect(screen.getByLabelText(/additional notes/i)).toBeRequired();
  });
});

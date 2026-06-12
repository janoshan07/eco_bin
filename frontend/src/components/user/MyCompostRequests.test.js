const { TextEncoder, TextDecoder } = require('util');
global.TextEncoder = TextEncoder;
global.TextDecoder = TextDecoder;

const React = require('react');
const { render, screen, fireEvent, waitFor } = require('@testing-library/react');
const { BrowserRouter: Router } = require('react-router-dom');
const axios = require('axios');
require('@testing-library/jest-dom');
const MyCompostRequests = require('./MyCompostRequests').default;

jest.mock('axios');

describe('MyCompostRequests Component', () => {
    const compostRequestsMock = [
        {
            _id: '1',
            potential: 100,
            amount: 50,
            cost: 12500,
            address: '123 Compost St',
            status: 'Pending'
        },
        {
            _id: '2',
            potential: 200,
            amount: 100,
            cost: 25000,
            address: '456 Compost Ave',
            status: 'Completed'
        }
    ];

    beforeEach(() => {
        localStorage.setItem('userEmail', 'test@example.com'); // Mock user email in local storage
        axios.get.mockResolvedValue({ data: compostRequestsMock });
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    test('renders My Compost Requests title', async () => {
        render(
            <Router>
                <MyCompostRequests />
            </Router>
        );

        const titleElement = screen.getByText(/My Compost Requests/i);
        expect(titleElement).toBeInTheDocument();
        
        // Wait for async fetch to resolve and render rows to prevent act() leaks
        await screen.findByText(/123 Compost St/i);
    });

    test('fetches and displays compost requests', async () => {
        render(
            <Router>
                <MyCompostRequests />
            </Router>
        );

        const potentialWeightElement = await screen.findByText(/200/i);
        expect(potentialWeightElement).toBeInTheDocument();
        
        const addressElement = await screen.findByText(/123 Compost St/i);
        expect(addressElement).toBeInTheDocument();
    });

    test('deletes a compost request', async () => {
        axios.delete.mockResolvedValue({}); // Mock delete response

        render(
            <Router>
                <MyCompostRequests />
            </Router>
        );

        // Click the delete button for the first request
        const deleteButtons = await screen.findAllByText(/Delete/i);
        fireEvent.click(deleteButtons[0]);

        // Ensure the request is removed from the document
        await waitFor(() => {
            expect(screen.queryByText(/123 Compost St/i)).not.toBeInTheDocument();
        });
    });

    test('edits and updates a compost request', async () => {
        render(
            <Router>
                <MyCompostRequests />
            </Router>
        );

        // Click the edit button for the first request
        const editButtons = await screen.findAllByText(/Edit/i);
        fireEvent.click(editButtons[0]);

        // Change the amount and address
        const amountInput = screen.getByRole('spinbutton'); // Number input for amount
        fireEvent.change(amountInput, { target: { value: '60' } });

        const addressInput = screen.getByDisplayValue('123 Compost St'); // Text input for address
        fireEvent.change(addressInput, { target: { value: '789 Compost Blvd' } });

        // Mock the update request
        axios.put.mockResolvedValue({});

        // Click the save button
        const saveButton = screen.getByText(/Save/i);
        fireEvent.click(saveButton);

        // Check if the updated values are displayed
        await waitFor(() => {
            expect(screen.getByText(/60/i)).toBeInTheDocument();
            expect(screen.getByText(/789 Compost Blvd/i)).toBeInTheDocument();
        });
    });

    test('displays message when no compost requests are found', async () => {
        axios.get.mockResolvedValue({ data: [] }); // Mock no data response

        render(
            <Router>
                <MyCompostRequests />
            </Router>
        );

        const messageElement = await screen.findByText(/No compost requests found/i);
        expect(messageElement).toBeInTheDocument();
    });
});

import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import TaskManager from './TaskManager';
import axios from 'axios';
import MockAdapter from 'axios-mock-adapter';

const mock = new MockAdapter(axios);

describe('TaskManager Pagination and Refresh Tests', () => {
    beforeEach(() => {
        mock.reset();
    });

    test('renders pagination controls', async () => {
        mock.onGet('http://localhost:8080/task/pages?page=0&size=5').reply(200, {
            content: [],
            totalElements: 20,
        });

        render(<TaskManager />);

        // Wait for the component to fetch and render
        await waitFor(() => {
            expect(screen.getByText(/Items per page/i)).toBeInTheDocument();
            expect(screen.getByText('First')).toBeInTheDocument();
            expect(screen.getByText('Prev')).toBeInTheDocument();
            expect(screen.getByText('Next')).toBeInTheDocument();
            expect(screen.getByText('Last')).toBeInTheDocument();
        });
    });

    test('changes page when "Next" is clicked', async () => {
        mock.onGet('http://localhost:8080/task/pages?page=0&size=5').reply(200, {
            content: [],
            totalElements: 20,
        });
        mock.onGet('http://localhost:8080/task/pages?page=1&size=5').reply(200, {
            content: [],
            totalElements: 20,
        });

        render(<TaskManager />);

        // Wait for the initial fetch
        await waitFor(() => screen.getByText('1'));

        fireEvent.click(screen.getByText('Next'));

        // Wait for the next page to be rendered
        await waitFor(() => {
            expect(screen.getByText('2')).toBeInTheDocument();
        });
    });

    test('disables "Prev" button on first page', async () => {
        mock.onGet('http://localhost:8080/task/pages?page=0&size=5').reply(200, {
            content: [],
            totalElements: 20,
        });

        render(<TaskManager />);

        // Wait for the initial fetch
        await waitFor(() => {
            expect(screen.getByText('Prev')).toBeDisabled();
        });
    });

    test('disables "Next" button on last page', async () => {
        mock.onGet('http://localhost:8080/task/pages?page=0&size=5').reply(200, {
            content: [],
            totalElements: 5,
        });

        render(<TaskManager />);

        // Wait for the initial fetch
        await waitFor(() => {
            expect(screen.getByText('Next')).toBeDisabled();
        });
    });

    test('refreshes tasks when refresh button is clicked', async () => {
        const tasks = [{ id: 1, assignedTo: 'John', statusEnum: 'NOT_STARTED', dueDate: '2024-01-01', priority: 'HIGH', comments: '' }];

        mock.onGet('http://localhost:8080/task/pages?page=0&size=5').reply(200, {
            content: tasks,
            totalElements: 1,
        });

        render(<TaskManager />);

        // Initially fetch tasks
        await waitFor(() => {
            expect(screen.getByText('John')).toBeInTheDocument();
        });

        // Mocking the refresh action
        mock.onGet('http://localhost:8080/task/pages?page=0&size=5').reply(200, {
            content: [],
            totalElements: 0,
        });

        fireEvent.click(screen.getByText('Refresh'));

        // Wait for the refresh to complete
        await waitFor(() => {
            expect(screen.queryByText('John')).not.toBeInTheDocument();
        });
    });
});
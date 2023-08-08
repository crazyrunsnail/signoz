import { render, screen, waitFor } from '@testing-library/react';
import ROUTES from 'constants/routes';
import { Provider } from 'react-redux';
import { BrowserRouter } from 'react-router-dom';
import store from 'store';

import { services } from './__mocks__/getServices';
import ServiceTraceTable from './ServiceTracesTable';

jest.mock('react-router-dom', () => ({
	...jest.requireActual('react-router-dom'),
	useLocation: (): { pathname: string } => ({
		pathname: `${process.env.FRONTEND_API_ENDPOINT}${ROUTES.APPLICATION}/`,
	}),
}));

describe('Metrics Component', () => {
	it('renders without errors', async () => {
		render(
			<Provider store={store}>
				<BrowserRouter>
					<ServiceTraceTable services={services} loading={false} />
				</BrowserRouter>
			</Provider>,
		);

		await waitFor(() => {
			expect(screen.getByText(/application/i)).toBeInTheDocument();
			expect(screen.getByText(/p99 latency \(in ms\)/i)).toBeInTheDocument();
			expect(screen.getByText(/error rate \(% of total\)/i)).toBeInTheDocument();
			expect(screen.getByText(/Operation Per Second/i)).toBeInTheDocument();
		});
	});

	it('renders if the data is loaded in the table', async () => {
		render(
			<Provider store={store}>
				<BrowserRouter>
					<ServiceTraceTable services={services} loading={false} />
				</BrowserRouter>
			</Provider>,
		);

		expect(screen.getByText('frontend')).toBeInTheDocument();
	});

	it('renders no data when required conditions are met', async () => {
		render(
			<Provider store={store}>
				<BrowserRouter>
					<ServiceTraceTable services={[]} loading={false} />
				</BrowserRouter>
			</Provider>,
		);

		expect(screen.getByText('No data')).toBeInTheDocument();
	});
});

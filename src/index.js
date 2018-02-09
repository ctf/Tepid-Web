import 'babel-polyfill';

import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter } from 'react-router-dom';

import { createStore, applyMiddleware } from 'redux';
import { Provider } from 'react-redux';
import thunkMiddleware from 'redux-thunk';
import { createLogger } from 'redux-logger';
import { persistStore, persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage'
import { PersistGate } from 'redux-persist/lib/integration/react'

import tepidReducer from './reducers';

import { CTFerRoute, UserRoute, GuestRoute } from './components/auth_routes';

import DashboardPage from './pages/DashboardPage';
import SignInPage from './pages/SignInPage';
import QueuesPage from './pages/QueuesPage';
import LogsPage from './pages/LogsPage';
import ConstitutionPage from './pages/ConstitutionPage';
import StatisticsPage from './pages/StatisticsPage';
import AccountPage from './pages/AccountPage';
import MyAccountPage from './pages/MyAccountPage';

import './index.css';

class Tepid extends React.Component {
	render() {
		return (
			<div>
				<GuestRoute path="/sign-in" component={SignInPage} />
				<UserRoute exact path="/" component={DashboardPage} />
				<CTFerRoute path="/accounts" component={AccountPage} />
				<UserRoute path="/my-account" component={MyAccountPage} />
				<CTFerRoute path="/queues" component={QueuesPage} />
				<CTFerRoute path="/statistics" component={StatisticsPage} />
				<CTFerRoute path="/logs" component={LogsPage} />
				<CTFerRoute path="/constitution" component={ConstitutionPage} />
			</div>
		);
	}
}

// -----------------------------------------------------------------------------

const loggerMiddleware = createLogger();

const persistConfig = {
	key: 'root',
	storage: storage,
	whitelist: ['auth']
};

const persistedReducer = persistReducer(persistConfig, tepidReducer);

const store = createStore(
	persistedReducer,
	applyMiddleware(
		thunkMiddleware,
		loggerMiddleware
	)
);

const persistor = persistStore(store);

ReactDOM.render(
	<Provider store={store}>
		<PersistGate persistor={persistor}>
			<BrowserRouter>
				<Tepid auth={store.getState().auth} />
			</BrowserRouter>
		</PersistGate>
	</Provider>,
	document.getElementById('tepid-web-app-root')
);

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

import Tepid from './components/Tepid';

import './index.css';

// -----------------------------------------------------------------------------

const preloadedState = window.__PRELOADED_STATE__;
delete window.__PRELOADED_STATE__;

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

const persistor = persistStore(store, preloadedState);

ReactDOM.hydrate(
	<Provider store={store}>
		<PersistGate persistor={persistor}>
			<BrowserRouter>
				<Tepid auth={store.getState().auth} />
			</BrowserRouter>
		</PersistGate>
	</Provider>,
	document.getElementById('tepid-web-app-root')
);

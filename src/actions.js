import fetch from 'cross-fetch';

import { buildToken } from './tepid-utils';

// TEMPORARY:
export const API_URL = 'https://tepid.science.mcgill.ca:8443/tepid';

// Auth ------------------------------------------------------------------------

export const REQUEST_AUTH = 'REQUEST_AUTH';
export const requestAuth = (credentials) => ({
	type: REQUEST_AUTH,
	credentials
});

export const RECEIVE_AUTH = 'RECEIVE_AUTH';
export const receiveAuth = (json) => ({
	type: RECEIVE_AUTH,
	user: json.user,
	role: json.role,
	session: {
		id: json._id,
		expiration: json.expiration
	},
	valid: json.valid,
	receivedAt: Date.now()
});

export const INVALIDATE_AUTH = 'INVALIDATE_AUTH';
export const invalidateAuth = () => {
	return ({
		type: INVALIDATE_AUTH
	});
};

export const attemptAuth = function (credentials) {
	return dispatch => {
		// TODO: Check validity / handle errors
		dispatch(requestAuth(credentials));

		let fetchObject = {
			method: 'POST',
			headers: {
				'Accept': 'application/json',
				'Content-Type': 'application/json'
			},
			body: JSON.stringify({...credentials})
		};

		// noinspection JSUnresolvedFunction
		return fetch(`${API_URL}/sessions`, fetchObject)
			.then(response => response.json())
			.then(json => dispatch(receiveAuth(json)));
	};
};

// Queues ----------------------------------------------------------------------

export const REQUEST_QUEUES = 'REQUEST_QUEUES';
export const requestQueues = () => ({
	type: REQUEST_QUEUES
});


export const RECEIVE_QUEUES = 'RECEIVE_QUEUES';
export const receiveQueues = json => ({
	type: RECEIVE_QUEUES,
	queues: json,
	receivedAt: Date.now()
});

export const INVALIDATE_QUEUES = 'INVALIDATE_QUEUES';
export const invalidateQueues = () => ({
	type: INVALIDATE_QUEUES
});

const fetchQueues = () => dispatch => {
	dispatch(requestQueues);
	// noinspection JSUnresolvedFunction
	return fetch(`${API_URL}/queues`)
		.then(response => response.json())
		.then(json => dispatch(receiveQueues(json)))
};

const shouldFetchQueues = state => {
	const queues = state.queues;
	if (queues.isFetching) {
		return false;
	} else if (queues.items.length === 0) {
		return true;
	} else {
		return queues.didInvalidate;
	}
};

export const fetchQueuesIfNeeded = () => (dispatch, getState) => {
	if (shouldFetchQueues(getState())) {
		console.log('fetching qs', getState());
		return dispatch(fetchQueues());
	} else {
		return Promise.resolve();
	}
};

// Destinations ----------------------------------------------------------------

export const REQUEST_DESTINATIONS = 'REQUEST_DESTINATIONS';
export const requestDestinations = () => ({
	type: REQUEST_DESTINATIONS
});

export const RECEIVE_DESTINATIONS = 'RECEIVE_DESTINATIONS';
export const receiveDestinations = json => ({
	type: RECEIVE_DESTINATIONS,
	destinations: json,
	receivedAt: Date.now()
});

const fetchDestinations = auth => dispatch => {
	dispatch(requestDestinations());

	const fetchObject = {
		method: 'GET',
		headers: {
			'Accept': 'application/json',
			'Authorization': `Token ${buildToken(auth)}`
		}
	};

	// noinspection JSUnresolvedFunction
	return fetch(`${API_URL}/destinations`, fetchObject)
		.then(response => {
			if (response.status === 401) {
				dispatch(invalidateAuth()); // To be used for redirection
				return [];
			} else if (!response.ok) {
				// TODO: Handle error better
				console.error(response);
				return [];
			}
			return response.json();
		})
		.then(json => dispatch(receiveDestinations(json)));
};

const shouldFetchDestinations = state => {
	const destinations = state.destinations;
	if (destinations.isFetching) {
		return false;
	} else if (Object.keys(destinations.items).length === 0) {
		return true;
	} else {
		return destinations.didInvalidate;
	}
};

export const fetchDestinationsIfNeeded = () => (dispatch, getState) => {
	const state = getState();
	if (shouldFetchDestinations(state)) {
		return dispatch(fetchDestinations(state.auth));
	} else {
		return Promise.resolve();
	}
};

// Jobs ------------------------------------------------------------------------

// -- Queue Jobs ---------------------------------------------------------------

export const REQUEST_QUEUE_JOBS = 'REQUEST_QUEUE_JOBS';
export const requestQueueJobs = queue => ({
	type: REQUEST_QUEUE_JOBS,
	queue
});

export const RECEIVE_QUEUE_JOBS = 'RECEIVE_QUEUE_JOBS';
export const receiveQueueJobs = (queue, json) => ({
	type: RECEIVE_QUEUE_JOBS,
	queue,
	jobs: json,
	receivedAt: Date.now()
});

const fetchQueueJobs = (auth, queueName, limit = -1) => dispatch => {
	dispatch(requestQueueJobs(queueName));

	const fetchObject = {
		method: 'GET',
		headers: {
			'Accept': 'application/json',
			'Authorization': `Token ${buildToken(auth)}`
		}
	};

	// noinspection JSUnresolvedFunction
	return fetch(`${API_URL}/queues/${queueName}`, fetchObject)
		.then(response => {
			if (response.status === 401) {
				dispatch(invalidateAuth()); // To be used for redirection
				return [];
			} else if (!response.ok) {
				// TODO: Handle error better
				console.error(response);
				return [];
			}
			return response.json();
		})
		.then(json => dispatch(receiveQueueJobs(queueName, json)));
};

const shouldFetchQueueJobs = (state, queueName) => {
	if (Object.keys(state.queues.jobsByQueue).length === 0) {
		// Have to fetch Queues first
		return false;
	}

	const queueJobs = state.queues.jobsByQueue[queueName];
	if (queueJobs.isFetching) {
		return false;
	} else if (queueJobs.items.length === 0) {
		return true;
	} else {
		return queueJobs.didInvalidate;
	}
};

export const fetchQueueJobsIfNeeded = (queueName) => (dispatch, getState) => {
	return dispatch(fetchQueuesIfNeeded()).then(() => {
		const state = getState();
		if (shouldFetchQueueJobs(state, queueName)) {
			return dispatch(fetchQueueJobs(state.auth, queueName));
		} else {
			return Promise.resolve();
		}
	});
};

export const fetchAllQueueJobsIfNeeded = () => (dispatch, getState) => {
	const state = getState();
	return Promise.all(state.queues.items.map(queue => dispatch(fetchQueueJobsIfNeeded(queue.name))));
};

// -- Job Actions --------------------------------------------------------------

export const ADD_JOB = 'ADD_JOB';
export const addJob = job => ({
	type: ADD_JOB,
	job
});

export const REFUND_JOB = 'REFUND_JOB';
export const refundJob = jobId => ({
	type: REFUND_JOB,
	jobId
});

// Accounts --------------------------------------------------------------------

export const REQUEST_ACCOUNT = 'REQUEST_ACCOUNT';
export const requestAccount = shortUser => ({
	type: REQUEST_ACCOUNT,
	shortUser
});

export const RECEIVE_ACCOUNT = 'RECEIVE_ACCOUNT';
export const receiveAccount = (shortUser, json) => ({
	type: RECEIVE_ACCOUNT,
	shortUser,
	account: json,
	receivedAt: Date.now()
});

const fetchAccount = (auth, shortUser) => dispatch => {
	dispatch(requestAccount(shortUser));

	const fetchObject = {
		method: 'GET',
		headers: {
			'Accept': 'application/json',
			'Authorization': `Token ${buildToken(auth)}`
		}
	};

	// noinspection JSUnresolvedFunction
	return fetch(`${API_URL}/users/${shortUser}`, fetchObject)
		.then(response => {
			if (response.status === 401) {
				dispatch(invalidateAuth()); // To be used for redirection
				return [];
			} else if (!response.ok) {
				// TODO: Handle error better
				console.error(response);
				return [];
			}
			return response.json();
		})
		.then(json => dispatch(receiveAccount(shortUser, json)));
};

const shouldFetchAccount = (state, shortUser) => {
	const accounts = state.accounts.items;
	if (!Object.keys(accounts).includes(shortUser)) {
		return true;
	} else {
		return accounts[shortUser].didInvalidate;
	}
};

export const fetchAccountIfNeeded = shortUser => (dispatch, getState) => {
	const state = getState();
	if (shouldFetchAccount(state, shortUser)) {
		return dispatch(fetchAccount(state.auth, shortUser));
	} else {
		return Promise.resolve();
	}
};

export const REQUEST_ACCOUNT_QUOTA = 'REQUEST_ACCOUNT_QUOTA';
export const requestAccountQuota = shortUser => ({
	type: REQUEST_ACCOUNT_QUOTA,
	shortUser
});

export const RECEIVE_ACCOUNT_QUOTA = 'RECEIVE_ACCOUNT_QUOTA';
export const receiveAccountQuota = (shortUser, quota) => ({
	type: RECEIVE_ACCOUNT_QUOTA,
	shortUser,
	quota,
	receivedAt: Date.now()
});

const fetchAccountQuota = (auth, shortUser) => dispatch => {
	dispatch(requestAccountQuota(shortUser));

	const fetchObject = {
		method: 'GET',
		headers: {
			'Accept': 'application/json',
			'Authorization': `Token ${buildToken(auth)}`
		}
	};

	// noinspection JSUnresolvedFunction
	return fetch(`${API_URL}/users/${shortUser}/quota`, fetchObject)
		.then(response => {
			if (response.status === 401) {
				dispatch(invalidateAuth()); // To be used for redirection
				return [];
			} else if (!response.ok) {
				// TODO: Handle error better
				console.error(response);
				return [];
			}
			return response.json();
		})
		.then(json => dispatch(receiveAccountQuota(shortUser, json)));
};

const shouldFetchAccountQuota = (state, shortUser) => {
	const accounts = state.accounts.items;
	if (!Object.keys(accounts).includes(shortUser)) {
		return false;
	} else if (accounts[shortUser].quota.isFetching) {
		return false;
	} else if (!accounts[shortUser].quota.amount) { // TODO: Expiry time
		return true;
	} else {
		return accounts[shortUser].quota.didInvalidate;
	}
};

export const fetchAccountQuotaIfNeeded = shortUser => (dispatch, getState) => {
	const state = getState();
	if (shouldFetchAccountQuota(state, shortUser)) {
		return dispatch(fetchAccountQuota(state.auth, shortUser));
	} else {
		return Promise.resolve();
	}
};

export const REQUEST_ACCOUNT_JOBS = 'REQUEST_ACCOUNT_JOBS';
export const requestAccountJobs = shortUser => ({
	type: REQUEST_ACCOUNT_JOBS,
	shortUser
});

export const RECEIVE_ACCOUNT_JOBS = 'RECEIVE_ACCOUNT_JOBS';
export const receiveAccountJobs = (shortUser, jobs) => ({
	type: RECEIVE_ACCOUNT_JOBS,
	shortUser,
	jobs,
	receivedAt: Date.now()
});

const fetchAccountJobs = (auth, shortUser) => dispatch => {
	dispatch(requestAccountJobs(shortUser));

	const fetchObject = {
		method: 'GET',
		headers: {
			'Accept': 'application/json',
			'Authorization': `Token ${buildToken(auth)}`
		}
	};

	// noinspection JSUnresolvedFunction
	return fetch(`${API_URL}/jobs/${shortUser}`, fetchObject)
		.then(response => {
			if (response.status === 401) {
				dispatch(invalidateAuth()); // To be used for redirection
				return [];
			} else if (!response.ok) {
				// TODO: Handle error better
				console.error(response);
				return [];
			}
			return response.json();
		})
		.then(json => dispatch(receiveAccountJobs(shortUser, json)));
};

const shouldFetchAccountJobs = (state, shortUser) => {
	const accounts = state.accounts.items;
	if (!Object.keys(accounts).includes(shortUser)) {
		return false;
	} else if (accounts[shortUser].jobs.isFetching) {
		return false;
	} else if (accounts[shortUser].jobs.items.length === 0) { // TODO: Expiry time
		return true;
	} else {
		return accounts[shortUser].jobs.didInvalidate;
	}
};

export const fetchAccountJobsIfNeeded = shortUser => (dispatch, getState) => {
	const state = getState();
	if (shouldFetchAccountJobs(state, shortUser)) {
		return dispatch(fetchAccountJobs(state.auth, shortUser));
	} else {
		return Promise.resolve();
	}
};

export const fetchAccountAndRelatedDataIfNeeded = shortUser => (dispatch, getState) => {
	return Promise.all([
		dispatch(fetchAccountIfNeeded(shortUser)),
		dispatch(fetchAccountQuotaIfNeeded(shortUser)),
		dispatch(fetchAccountJobsIfNeeded(shortUser))
	]);
};

// Combined Actions ------------------------------------------------------------

export const attemptAuthAndLoadInitialData = credentials => (dispatch, getState) => {
	return dispatch(attemptAuth(credentials))
		.then(() => dispatch(fetchQueuesIfNeeded()))
		.then(() => dispatch(fetchAllQueueJobsIfNeeded()));
};

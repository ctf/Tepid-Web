import fetch from 'cross-fetch';

import {buildToken} from './tepid-utils';
import {Destination, PrintJob, PrintQueue, PutResponse, QuotaData, User} from "./models";

export const API_URL = process.env.REACT_APP_WEB_URL_PRODUCTION || 'https://localhost:8443/tepid';

const authHeader = (auth) => ({
	'Authorization': `Token ${buildToken(auth)}`
});

const standardHeaders = (auth) => ({
	'Content-Type': 'application/json',
	'Accept': 'application/json',
	'Authorization': `Token ${buildToken(auth)}`
});

// Auth ------------------------------------------------------------------------
export type ActionTypesAuth = ARequestAuth | AReceiveAuth

export const REQUEST_AUTH = 'REQUEST_AUTH';
interface ARequestAuth {
	type: typeof REQUEST_AUTH,
	credentials: {
		username: string,
		password: string,
	}
}
export const requestAuth = (credentials): ARequestAuth => ({
	type: REQUEST_AUTH,
	credentials
});

export const RECEIVE_AUTH = 'RECEIVE_AUTH';
interface AReceiveAuth {
	type: typeof RECEIVE_AUTH,
	user: string,
	role: string,
	session: {
		id: string,
		expiration: Date | null,
	},
	valid: boolean,
	receivedAt: Date,
}
export const receiveAuth = (json): AReceiveAuth => ({
	type: RECEIVE_AUTH,
	user: json.user,
	role: json.role,
	session: {
		id: json._id,
		expiration: json.expiration
	},
	valid: json.valid,
	receivedAt: new Date()
});

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

export type ActionTypesInvalidateAuth = ARequestInvalidateAuth | AReceiveInvalidateAuth;
export const REQUEST_INVALIDATE_AUTH = 'REQUEST_INVALIDATE_AUTH';
interface ARequestInvalidateAuth {
	type: typeof REQUEST_INVALIDATE_AUTH,
}
export const requestInvalidateAuth = (): ARequestInvalidateAuth => {
	return ({
		type: REQUEST_INVALIDATE_AUTH
	});
};

export const RECEIVE_INVALIDATE_AUTH = 'RECEIVE_INVALIDATE_AUTH';
interface AReceiveInvalidateAuth {
	type: typeof RECEIVE_INVALIDATE_AUTH,
	success: boolean,
}
export const receiveInvalidateAuth = (success): AReceiveInvalidateAuth => {
	return ({
		type: RECEIVE_INVALIDATE_AUTH,
		success
	});
};

export const invalidateAuth = () => {
	return (dispatch, getState) => {
		const state = getState();

		const fetchObject = {
			method: 'DELETE',
			headers: authHeader(state.auth),
		};

		dispatch(requestInvalidateAuth());
		return fetch(`${API_URL}/sessions/${state.auth.session.id}`, fetchObject)
			.then(
				response => response,
				error => handleError(error),
			).then((response) => {
				dispatch(receiveInvalidateAuth(response["ok"]))
			})

	}
};

// Queues ----------------------------------------------------------------------
export type ActionTypesQueues = ARequestQueues | AReceiveQueues | AInvalidateQueues

export const REQUEST_QUEUES = 'REQUEST_QUEUES';
interface ARequestQueues {
	type: typeof REQUEST_QUEUES
}
export const requestQueues = (): ARequestQueues => ({
	type: REQUEST_QUEUES
});

export const RECEIVE_QUEUES = 'RECEIVE_QUEUES';
interface AReceiveQueues {
	type: typeof RECEIVE_QUEUES,
	queues: Map<string, PrintQueue>,
	receivedAt: Date,
}
export const receiveQueues = (json): AReceiveQueues => ({
	type: RECEIVE_QUEUES,
	queues: json,
	receivedAt: new Date()
});

export const INVALIDATE_QUEUES = 'INVALIDATE_QUEUES';
interface AInvalidateQueues {
	type: typeof INVALIDATE_QUEUES
}
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
	} else if (Object.keys(queues.items).length === 0) {
		return true;
	} else {
		return queues.didInvalidate;
	}
};

export const fetchQueuesIfNeeded = () => (dispatch, getState) => {
	if (shouldFetchQueues(getState())) {
		return dispatch(fetchQueues());
	} else {
		return Promise.resolve();
	}
};

export const REQUEST_PUT_QUEUE = 'REQUEST_PUT_QUEUE';

interface ARequestPutQueue {
	type: typeof REQUEST_PUT_QUEUE,
	queue: PrintQueue
}

export const requestPutQueue = (queue: PrintQueue): ARequestPutQueue => ({
	type: REQUEST_PUT_QUEUE,
	queue
});

export const RECEIVE_PUT_QUEUE = 'RECEIVE_PUT_QUEUE';

interface AReceivePutQueue {
	type: typeof RECEIVE_PUT_QUEUE,
	putResponse: PutResponse,
	newQueue: PrintQueue
}

export const receivePutQueue = (putResponse: PutResponse, newQueue: PrintQueue): AReceivePutQueue => ({
	type: RECEIVE_PUT_QUEUE,
	putResponse,
	newQueue
});

export const putQueue = (queue: PrintQueue) => {
	return (dispatch, getState) => {
		const state = getState();

		if (queue._id === undefined) throw "no _id"

		const fetchObject = {
			method: 'PUT',
			headers: standardHeaders(state.auth),
			body: JSON.stringify(queue)
		};

		dispatch(requestPutQueue(queue));
		return fetch(`${API_URL}/queues/${encodeURIComponent(queue._id)}`, fetchObject)
			.then(
				response => {
					if (response.ok) {
						return response.json()
					} else {
						handleError(response)
					}
				},
			).then((body:PutResponse) => {
				if (body.ok) {
					dispatch(receivePutQueue(body, queue))
				}
			})
	}
};

// Destinations ----------------------------------------------------------------
export type ActionTypesDestinations = ARequestDestinations | AReceiveDestinations

export const REQUEST_DESTINATIONS = 'REQUEST_DESTINATIONS';
interface ARequestDestinations {
	type: typeof REQUEST_DESTINATIONS
}
export const requestDestinations = (): ARequestDestinations => ({
	type: REQUEST_DESTINATIONS
});

export const RECEIVE_DESTINATIONS = 'RECEIVE_DESTINATIONS';
interface AReceiveDestinations {
	type: typeof RECEIVE_DESTINATIONS,
	receivedAt: Date,
	destinations: Map<string, Destination>,
}
export const receiveDestinations = (json): AReceiveDestinations => ({
	type: RECEIVE_DESTINATIONS,
	destinations: json,
	receivedAt: new Date()
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

// Tickets ---------------------------------------------------------------------
export type ActionTypesTickets = AManageDestinationTicket | AConfirmDestinationTicket

export interface Ticket {
	reason: string,
	up: boolean,
}

export const MANAGE_DESTINATION_TICKET = 'MANAGE_DESTINATION_TICKET';
interface AManageDestinationTicket {
	type: typeof MANAGE_DESTINATION_TICKET,
	ticket: Ticket,
	destination: Destination,
}
export const manageDestinationTicket = (destination, ticket) => ({
	type: MANAGE_DESTINATION_TICKET,
	ticket,
	destination,
});

export const CONFIRM_DESTINATION_TICKET = 'CONFIRM_DESTINATION_TICKET';
interface AConfirmDestinationTicket {
	type: typeof CONFIRM_DESTINATION_TICKET,
	ticket: Ticket,
	up: boolean,
	destination: Destination,
}
export const confirmDestinationTicket = (destination, ticket, up) => ({
	type: CONFIRM_DESTINATION_TICKET,
	ticket,
	up,
	destination,
});

const doManageDestinationTicket = (destination, up, reason) => {
	return (dispatch, getState) => {
		const state = getState();

		const ticket = {
			up: up,
			reason,
		};
		const fetchObject = {
			method: 'POST',
			headers: standardHeaders(state.auth),
			body: JSON.stringify(ticket)
		};

		dispatch(manageDestinationTicket(destination, ticket));
		return fetch(`${API_URL}/destinations/${encodeURIComponent(destination._id)}/ticket`, fetchObject)
			.then(
				response => {
					if (response.ok) {
						return response.json()
					} else {
						handleError(null)
					}
				},
			).then((body: PutResponse) => {
				if (body.ok) {
					dispatch(confirmDestinationTicket(destination, ticket, ticket.up))
				}
			})
	}
};
export const submitDestinationTicket = (destination, reason) => {
	return doManageDestinationTicket(destination, false, reason)
};
export const resolveDestinationTicket = (destination) => {
	return doManageDestinationTicket(destination, true, '')
};


// Jobs ------------------------------------------------------------------------
// see also Job Actions

// -- Queue Jobs ---------------------------------------------------------------
export type ActionTypesQueueJobs = ARequestQueueJobs | AReceiveQueueJobs

export const REQUEST_QUEUE_JOBS = 'REQUEST_QUEUE_JOBS';
interface ARequestQueueJobs {
	type: typeof REQUEST_QUEUE_JOBS,
	queue: string,
}
export const requestQueueJobs = (queue): ARequestQueueJobs => ({
	type: REQUEST_QUEUE_JOBS,
	queue
});

export const RECEIVE_QUEUE_JOBS = 'RECEIVE_QUEUE_JOBS';
interface AReceiveQueueJobs {
	type: typeof RECEIVE_QUEUE_JOBS,
	queue: string,
	jobs: PrintJob[],
	receivedAt: Date,
}
export const receiveQueueJobs = (queue, json) => ({
	type: RECEIVE_QUEUE_JOBS,
	queue,
	jobs: json,
	receivedAt: new Date(),
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
	return fetch(`${API_URL}/queues/${queueName}/jobs`, fetchObject)
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

const shouldFetchQueueJobs = (state, queueId) => {
	if (Object.keys(state.queues.jobsByQueue).length === 0) {
		// Have to fetch Queues first
		return false;
	}
	const queueJobs = state.queues.jobsByQueue[queueId];
	if (queueJobs.isFetching) {
		return false;
	} else if (queueJobs.items.length === 0) {
		return true;
	} else {
		return queueJobs.didInvalidate;
	}
};

export const fetchQueueJobsIfNeeded = (queueId) => (dispatch, getState) => {
	return dispatch(fetchQueuesIfNeeded()).then(() => {
		const state = getState();
		if (shouldFetchQueueJobs(state, queueId)) {
			return dispatch(fetchQueueJobs(state.auth, queueId));
		} else {
			return Promise.resolve();
		}
	});
};


export const fetchAllQueueJobsIfNeeded = () => (dispatch, getState) => {
	const state = getState();
	return Promise.all(Object.values(state.queues.items).map((queue: PrintQueue) => dispatch(fetchQueueJobsIfNeeded(queue._id))));
};

// -- Job Actions --------------------------------------------------------------
export type ActionTypesJobActions = AAddJob | ARequestJobRefunded | AReceiveJobRefunded | ARequestJobReprint | AReceiveJobReprint

export const ADD_JOB = 'ADD_JOB';
interface AAddJob {
	type: typeof ADD_JOB,
	job: PrintJob,
}
export const addJob = job => ({
	type: ADD_JOB,
	job
});

export const REQUEST_JOB_REFUNDED = 'REQUEST_JOB_REFUNDED';
interface ARequestJobRefunded {
	type: typeof REQUEST_JOB_REFUNDED,
	jobId: string,
	refunded: boolean
}
export const requestJobRefunded = (jobId, refunded = true): ARequestJobRefunded => ({
	type: REQUEST_JOB_REFUNDED,
	jobId,
	refunded,
});

export const RECEIVE_JOB_REFUNDED = 'RECEIVE_JOB_REFUNDED';
interface AReceiveJobRefunded {
	type: typeof RECEIVE_JOB_REFUNDED,
	jobId: string,
	ok: boolean,
}
export const receiveJobRefunded = (jobId, ok = false) => ({
	type: RECEIVE_JOB_REFUNDED,
	jobId,
	ok,
});

export const doSetJobRefunded = (job, refunded) => {
	return (dispatch, getState) => {
		const state = getState();
		const fetchObject = {
			method: 'PUT',
			headers: standardHeaders(state.auth),
			body: refunded.toString()
		};

		dispatch(requestJobRefunded(job._id, refunded));


		return fetch(`${API_URL}/jobs/${job._id}/refunded`, fetchObject)
			.then(
				response => response.json(),
				error => handleError(error)
			).then((json) => {
					dispatch(receiveJobRefunded(job._id, json.ok));
				}
			)
	}
};

export const REQUEST_JOB_REPRINT = 'REQUEST_JOB_REPRINT';

interface ARequestJobReprint {
	type: typeof REQUEST_JOB_REPRINT,
	jobId: string
}

export const requestJobReprint = (jobId) => ({
	type: REQUEST_JOB_REPRINT,
	jobId,
});

export const RECEIVE_JOB_REPRINT = 'RECEIVE_JOB_REPRINT';

interface AReceiveJobReprint {
	type: typeof RECEIVE_JOB_REPRINT,
	jobId: string,
	ok: boolean
}

export const receiveJobReprint = (jobId, ok) => ({
	type: RECEIVE_JOB_REPRINT,
	jobId,
	ok
});

export const doJobReprint = (job: PrintJob) => {
	return (dispatch, getState) => {
		const state = getState();
		const fetchObject = {
			method: 'POST',
			headers: standardHeaders(state.auth),
		};

		dispatch(requestJobReprint(job._id));

		return fetch(`${API_URL}/jobs/${job._id}/reprint`, fetchObject)
			.then(
				response => {
					if (response.ok) {
						return response.json()
					} else {
						handleError(response)
					}
				})
			.then(json => {
				dispatch(receiveJobReprint(job._id, json.ok));
				dispatch(fetchAccountJobs(state.auth, job.userIdentification));
				dispatch(fetchQueueJobs(state.auth, job.queueId));
			})
	}
};


// Accounts --------------------------------------------------------------------
export type ActionTypesAccounts = ARequestAccount | AReceiveAccount | ARequestAccountQuota | AReceiveAccountQuota;

export const REQUEST_ACCOUNT = 'REQUEST_ACCOUNT';
interface ARequestAccount {
	type: typeof REQUEST_ACCOUNT,
	shortUser: string,
}
export const requestAccount = (shortUser): ARequestAccount => ({
	type: REQUEST_ACCOUNT,
	shortUser
});

export const RECEIVE_ACCOUNT = 'RECEIVE_ACCOUNT';
interface AReceiveAccount {
	type: typeof RECEIVE_ACCOUNT,
	shortUser: string,
	account: User,
	receivedAt: Date,
}
export const receiveAccount = (shortUser, json): AReceiveAccount => ({
	type: RECEIVE_ACCOUNT,
	shortUser,
	account: json,
	receivedAt: new Date()
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
interface ARequestAccountQuota {
	type: typeof REQUEST_ACCOUNT_QUOTA,
	shortUser: string
}
export const requestAccountQuota = shortUser => ({
	type: REQUEST_ACCOUNT_QUOTA,
	shortUser
});

export const RECEIVE_ACCOUNT_QUOTA = 'RECEIVE_ACCOUNT_QUOTA';
interface AReceiveAccountQuota {
	type: typeof RECEIVE_ACCOUNT_QUOTA,
	shortUser: string,
	quota: QuotaData,
	receivedAt: Date,
}
export const receiveAccountQuota = (shortUser, quota) => ({
	type: RECEIVE_ACCOUNT_QUOTA,
	shortUser,
	quota,
	receivedAt: new Date()
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

export type ActionTypesAccountJobs = ARequestAccountJobs | AReceiveAccountJobs;

export const REQUEST_ACCOUNT_JOBS = 'REQUEST_ACCOUNT_JOBS';
interface ARequestAccountJobs {
	type: typeof REQUEST_ACCOUNT_JOBS,
	shortUser: string,
}
export const requestAccountJobs = shortUser => ({
	type: REQUEST_ACCOUNT_JOBS,
	shortUser
});

export const RECEIVE_ACCOUNT_JOBS = 'RECEIVE_ACCOUNT_JOBS';
interface AReceiveAccountJobs {
	type: typeof RECEIVE_ACCOUNT_JOBS,
	shortUser: string,
	jobs: PrintJob[],
	receivedAt: Date,
}
export const receiveAccountJobs = (shortUser, jobs) => ({
	type: RECEIVE_ACCOUNT_JOBS,
	shortUser,
	jobs,
	receivedAt: new Date()
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
	return fetch(`${API_URL}/users/${shortUser}/jobs`, fetchObject)
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
	dispatch(fetchAccountIfNeeded(shortUser))
		.then(() => {
				Promise.all([
					dispatch(fetchAccountQuotaIfNeeded(shortUser)),
					dispatch(fetchAccountJobsIfNeeded(shortUser)),
					dispatch(fetchDestinationsIfNeeded()),
				])
			}
		)
};

function handleError(error) {
	console.log("!!!!!!!!" + error)
}

export const doSetColorPrinting = (shortUser, enabled) => {
	return (dispatch, getState) => {
		const state = getState();
		const fetchObject = {
			method: 'PUT',
			headers: {
				'Content-Type': 'text/plain',
				'Accept': 'application/json',
				'Authorization': `Token ${buildToken(state.auth)}`
			},
			body: enabled.toString()
			// body: JSON.stringify(enabled)
		};
		return fetch(`${API_URL}/users/${shortUser}/color`, fetchObject)
			.then(
				response => response.json(),
				error => handleError(error)
			).then(() => {
					dispatch(fetchAccount(state.auth, shortUser))
				}
			)
	}
};

export const doSetExchangeStatus = (shortUser, exchange) => {
	return (dispatch, getState) => {
		const state = getState();
		const fetchObject = {
			method: 'PUT',
			headers: {
				'Content-Type': 'application/json',
				'Accept': 'application/json',
				'Authorization': `Token ${buildToken(state.auth)}`
			},
			body: exchange.toString()
			// body: JSON.stringify(enabled)
		};
		return fetch(`${API_URL}/users/${shortUser}/exchange`, fetchObject)
			.then(
				response => response.json(),
				error => handleError(error)
			).then(() => {
					dispatch(fetchAccount(state.auth, shortUser))
				}
			)
	}
};

export const doSetNick = (shortUser, salutation) => {
	return (dispatch, getState) => {
		const state = getState();
		const fetchObject = {
			method: 'PUT',
			headers: standardHeaders(state.auth),
			body: salutation
		};
		return fetch(`${API_URL}/users/${shortUser}/nick`, fetchObject)
			.then(
				response => response.json(),
				error => handleError(error)
			).then(() => {
				dispatch(fetchAccount(state.auth, shortUser))
			})
	}
};

// Account Actions -------------------------------------------------------------
export type ActionTypesUi = AReceiveUserAutosuggest;

export const RECEIVE_USER_AUTOSUGGEST = 'RECEIVE_USER_AUTOSUGGEST';
interface AReceiveUserAutosuggest {
	type: typeof RECEIVE_USER_AUTOSUGGEST,
	autosuggest: string,
}
export const receiveUserAutosuggest = (autosuggest): AReceiveUserAutosuggest => ({
	type: RECEIVE_USER_AUTOSUGGEST,
	autosuggest,
});

export const fetchAutoSuggest = (like, limit = 10) => {
	return  (dispatch, getState) => {
		const state = getState();
		const fetchObject = {
			method: 'GET',
			headers: standardHeaders(state.auth)
		};
		return fetch(`${API_URL}/users/autosuggest/${like}?limit=${limit}`, fetchObject)
			.then(
				response => {
					return (response.ok ? response.json() : handleError(response))
				}
			).then((json)=>{
				dispatch(receiveUserAutosuggest(json))
			}
		)
	}
};

// Combined Actions ------------------------------------------------------------

export const attemptAuthAndLoadInitialData = credentials => (dispatch, getState) => {
	return dispatch(attemptAuth(credentials))
		.then(() => dispatch(fetchQueuesIfNeeded()))
		.then(() => dispatch(fetchAllQueueJobsIfNeeded()));
};

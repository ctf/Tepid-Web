import fetch from 'cross-fetch';

import {message} from "antd";

import {buildToken} from './tepid-utils';
import {Destination, FullDestination, PrintJob, PrintQueue, PutResponse, QuotaData, User} from "./models";

export const API_URL = process.env.REACT_APP_WEB_URL_PRODUCTION || 'https://testpid.science.mcgill.ca:8443/tepid';

const authHeader = (auth) => ({
	'Authorization': `Token ${buildToken(auth)}`
});

const standardHeaders = (auth) => ({
	'Content-Type': 'application/json',
	'Accept': 'application/json',
	'Authorization': `Token ${buildToken(auth)}`
});

export enum ModifyAction { POST = 'POST', PUT = 'PUT', DELETE = 'DELETE' }

// Auth ------------------------------------------------------------------------
export type ActionTypesAuth = ARequestAuth | AReceiveAuth | AnErrorAuth;

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
	user: User,
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

export const ERROR_AUTH = 'ERROR_AUTH';
interface AnErrorAuth {
	type: typeof ERROR_AUTH
}
export const errorAuth = () => ({
	type: ERROR_AUTH
});

export const attemptAuth = credentials => async dispatch => {
	// TODO: Check validity / handle errors
	await dispatch(requestAuth(credentials));

	const fetchObject = {
		method: 'POST',
		headers: {
			'Accept': 'application/json',
			'Content-Type': 'application/json'
		},
		body: JSON.stringify({...credentials})
	};

	// noinspection JSUnresolvedFunction
	const response = await fetch(`${API_URL}/sessions`, fetchObject);
	if (response.ok) {
		const json = await response.json();
		await dispatch(receiveAuth(json));
	} else {
		message.error("Error signing in");
		await dispatch(errorAuth());
		handleError(response);
	}
};

export type ActionTypesInvalidateAuth = ARequestInvalidateAuth | AReceiveInvalidateAuth;
export const REQUEST_INVALIDATE_AUTH = 'REQUEST_INVALIDATE_AUTH';
interface ARequestInvalidateAuth {
	type: typeof REQUEST_INVALIDATE_AUTH,
}
export const requestInvalidateAuth = (): ARequestInvalidateAuth => ({
	type: REQUEST_INVALIDATE_AUTH
});

export const RECEIVE_INVALIDATE_AUTH = 'RECEIVE_INVALIDATE_AUTH';
interface AReceiveInvalidateAuth {
	type: typeof RECEIVE_INVALIDATE_AUTH,
	success: boolean,
}
export const receiveInvalidateAuth = (success): AReceiveInvalidateAuth => ({
	type: RECEIVE_INVALIDATE_AUTH,
	success
});

export const invalidateAuth = () => async (dispatch, getState) => {
	const state = getState();
	const fetchObject = {
		method: 'DELETE',
		headers: authHeader(state.auth),
	};
	try {
		await dispatch(requestInvalidateAuth());
		const response = await fetch(`${API_URL}/sessions/${state.auth.session.id}`, fetchObject);
		await dispatch(receiveInvalidateAuth(response.ok));
	} catch (error) {
		handleError(error);  // TODO: ActionshouldFetchQueueJobs
	}
};

// Queues ----------------------------------------------------------------------
export type ActionTypesQueues = ARequestQueues | AReceiveQueues | AInvalidateQueues | ARequestModifyQueue | AReceiveModifyQueue

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

const fetchQueues = () => async dispatch => {
	await dispatch(requestQueues);
	// noinspection JSUnresolvedFunction
	const response = await fetch(`${API_URL}/queues`);
	const json = await response.json();
	await dispatch(receiveQueues(json));
};

const shouldFetchQueues = state => {
	const queues = state.queues;
	return !queues.isFetching && (queues.items.length === 0 || queues.didInvalidate);
};

export const fetchQueuesIfNeeded = () => async (dispatch, getState) => {
	if (!shouldFetchQueues(getState())) return;
	await dispatch(fetchQueues());
};

export const REQUEST_MODIFY_QUEUE = 'REQUEST_MODIFY_QUEUE';

interface ARequestModifyQueue {
	type: typeof REQUEST_MODIFY_QUEUE,
	action: ModifyAction,
	queue: PrintQueue,
}

export const requestModifyQueue = (action: ModifyAction, queue: PrintQueue): ARequestModifyQueue => ({
	type: REQUEST_MODIFY_QUEUE,
	action,
	queue,
});

export const RECEIVE_MODIFY_QUEUE = 'RECEIVE_MODIFY_QUEUE';

interface AReceiveModifyQueue {
	type: typeof RECEIVE_MODIFY_QUEUE,
	action: ModifyAction,
	putResponse: PutResponse,
	newQueue: PrintQueue,
}

export const receiveModifyQueue = (action: ModifyAction, putResponse: PutResponse, newQueue: PrintQueue): AReceiveModifyQueue => ({
	type: RECEIVE_MODIFY_QUEUE,
	action,
	putResponse,
	newQueue
});

const dispatchModifyQueue = async (dispatch, action, queue, URL, fetchObject) => {
	await dispatch(requestModifyQueue(action, queue));
	const response = await fetch(URL, fetchObject);

	if (response.ok) {
		if (action === ModifyAction.DELETE) {
			return {ok: true, id: queue._id}
		}
		const json: PutResponse = await response.json();
		if (json.ok) {
			if (action === ModifyAction.POST){
				queue._id = json.id
			}
			await dispatch(receiveModifyQueue(action, json, queue))
		}
	} else {
		handleError(response)
	}
};

export const putQueue = (queue: PrintQueue) => async (dispatch, getState) => {
	const state = getState();

	const {action, URL} = queue._id === undefined
		? {action: ModifyAction.POST, URL: `${API_URL}/queues/`}
		: {action: ModifyAction.PUT, URL: `${API_URL}/queues/${encodeURIComponent(queue._id)}`};

	const fetchObject = {
		method: action,
		headers: standardHeaders(state.auth),
		body: JSON.stringify(queue)
	};

	return await dispatchModifyQueue(dispatch, action, queue, URL, fetchObject)
};

export const deleteQueue = (queue: PrintQueue) => async (dispatch, getState) => {
	const state = getState();

	if (queue._id === undefined) throw "no _id";
	const {action, URL} = {action: ModifyAction.DELETE, URL: `${API_URL}/queues/${encodeURIComponent(queue._id)}`};

	const fetchObject = {
		method: 'DELETE',
		headers: standardHeaders(state.auth),
		body: JSON.stringify(queue)
	};

	return await dispatchModifyQueue(dispatch, action, queue, URL, fetchObject)
};

// Destinations ----------------------------------------------------------------
export type ActionTypesDestinations = ARequestDestinations
	| AReceiveDestinations
	| ARequestModifyDestination
	| AReceiveModifyDestination

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

const fetchDestinations = auth => async dispatch => {
	await dispatch(requestDestinations());

	const fetchObject = {
		method: 'GET',
		headers: {
			'Accept': 'application/json',
			'Authorization': `Token ${buildToken(auth)}`
		}
	};

	// noinspection JSUnresolvedFunction
	const response = await fetch(`${API_URL}/destinations`, fetchObject);

	if (response.status === 401) {
		await dispatch(invalidateAuth()); // To be used for redirection
		return;
	} else if (!response.ok) {
		// TODO: Handle error better
		console.error(response);
		return;
	}

	const json = await response.json();
	await dispatch(receiveDestinations(json));
};

const shouldFetchDestinations = state => {
	const destinations = state.destinations;
	return !destinations.isFetching && (Object.keys(destinations.items).length === 0 || destinations.didInvalidate);
};

export const fetchDestinationsIfNeeded = () => async (dispatch, getState) => {
	const state = getState();
	if (shouldFetchDestinations(state)) {
		await dispatch(fetchDestinations(state.auth));
	}
};

export const REQUEST_MODIFY_DESTINATION = 'REQUEST_MODIFY_DESTINATION';

interface ARequestModifyDestination {
	type: typeof REQUEST_MODIFY_DESTINATION,
	action: ModifyAction,
	destination: FullDestination,
}

export const requestModifyDestination = (
	action: ModifyAction,
	destination: FullDestination
): ARequestModifyDestination => ({
	type: REQUEST_MODIFY_DESTINATION,
	action,
	destination,
});

export const RECEIVE_MODIFY_DESTINATION = 'RECEIVE_MODIFY_DESTINATION';

interface AReceiveModifyDestination {
	type: typeof RECEIVE_MODIFY_DESTINATION,
	action: ModifyAction,
	putResponse: PutResponse,
	newDestination: FullDestination
}

export const receiveModifyDestination = (
	action: ModifyAction,
	putResponse: PutResponse,
	newDestination: FullDestination
): AReceiveModifyDestination => ({
	type: RECEIVE_MODIFY_DESTINATION,
	action,
	putResponse,
	newDestination
});

const dispatchModifyDestination = async (dispatch, action, destination, URL, fetchObject) => {
	await dispatch(requestModifyDestination(action, destination));

	const response = await fetch(URL, fetchObject);

	if (response.ok) {
		const body: PutResponse = action === ModifyAction.DELETE
			? {ok: true, id: destination._id}
			: (await response.json());
		if (body.ok) {
			if (action === ModifyAction.POST) {
				destination._id = body.id;
			}
			await dispatch(receiveModifyDestination(action, body, destination));
		}
	} else {
		handleError(response)
	}
};


export const putDestination = (destination: FullDestination) => async (dispatch, getState) => {
	const state = getState();

	const {action, URL} = destination._id === undefined
		? {action: ModifyAction.POST, URL: `${API_URL}/destinations/`}
		: {action: ModifyAction.PUT, URL: `${API_URL}/destinations/${encodeURIComponent(destination._id)}`};

	const fetchObject = {
		method: action,
		headers: standardHeaders(state.auth),
		body: JSON.stringify(destination)
	};

	await dispatchModifyDestination(dispatch, action, destination, URL, fetchObject);
};

export const deleteDestination = (destination: FullDestination) => async (dispatch, getState) => {
	const state = getState();

	if (destination._id === undefined) throw "no _id";
	const {action, URL} = {
		action: ModifyAction.DELETE,
		URL: `${API_URL}/destinations/${encodeURIComponent(destination._id)}`
	};

	const fetchObject = {
		method: 'DELETE',
		headers: standardHeaders(state.auth),
		body: JSON.stringify(destination)
	};

	await dispatchModifyDestination(dispatch, action, destination, URL, fetchObject)
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


const parseTicketUpdateToStatus = (response) => {
	const match = response.match(/.* marked as (.*)/)[1];
	if (match === 'up') return true;
	if (match === 'down') return false;
	return null;
};

const doManageDestinationTicket = (destination, up, reason) => async (dispatch, getState) => {
	const state = getState();

	const ticket = {up, reason};
	const fetchObject = {
		method: 'POST',
		headers: standardHeaders(state.auth),
		body: JSON.stringify(ticket)
	};

	await dispatch(manageDestinationTicket(destination, ticket));
	try {
		const response = await fetch(`${API_URL}/destinations/${encodeURIComponent(destination._id)}`,
			fetchObject);
		const body = await response.text();
		const status = parseTicketUpdateToStatus(body);
		if (status !== null) {
			await dispatch(confirmDestinationTicket(destination, ticket, status))
		}
	} catch (error) {
		handleError(error);
	}
};
export const submitDestinationTicket = (destination, reason) =>
	doManageDestinationTicket(destination, false, reason);
export const resolveDestinationTicket = (destination) =>
	doManageDestinationTicket(destination, true, '');


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

const fetchQueueJobs = (auth, queueId, limit = -1) => async dispatch => {
	await dispatch(requestQueueJobs(queueId));

	const fetchObject = {
		method: 'GET',
		headers: {
			'Accept': 'application/json',
			'Authorization': `Token ${buildToken(auth)}`
		}
	};

	// noinspection JSUnresolvedFunction

	const response = await fetch(`${API_URL}/queues/${queueId}/jobs`, fetchObject);
	if (response.status === 401) {
		await dispatch(invalidateAuth()); // To be used for redirection
		return;
	} else if (!response.ok) {
		// TODO: Handle error better
		console.error(response);
		return;
	}
	const json = await response.json();
	await dispatch(receiveQueueJobs(queueId, json));
};

const QUEUE_DELAY = 10000;  // 10 seconds

const shouldFetchQueueJobs = (state, queueId) => {
	if (Object.keys(state.queues.jobsByQueue).length === 0) {
		// Have to fetch Queues first
		return false;
	}
	const queueJobs = state.queues.jobsByQueue[queueId];
	const timeSinceLastUpdate = queueJobs.lastUpdated
		? (new Date()).getTime() - queueJobs.lastUpdated.getTime()
		: QUEUE_DELAY + 1;
	return !queueJobs.isFetching &&
		((queueJobs.items.length === 0 && timeSinceLastUpdate > QUEUE_DELAY)
			|| queueJobs.didInvalidate);
};

export const fetchQueueJobsIfNeeded = (queueId) => async (dispatch, getState) => {
	await dispatch(fetchQueuesIfNeeded());
	const state = getState();
	if (shouldFetchQueueJobs(state, queueId)) {
		await dispatch(fetchQueueJobs(state.auth, queueId));
	}
};


export const fetchAllQueueJobsIfNeeded = () => (dispatch, getState) => {
	const state = getState();
	return Promise.all(Object.values(state.queues.items)
		.map((queue: PrintQueue) => dispatch(fetchQueueJobsIfNeeded(queue._id))));
};

// -- Job Actions --------------------------------------------------------------
export type ActionTypesJobActions = AAddJob
	| ARequestJobRefunded
	| AReceiveJobRefunded
	| ARequestJobReprint
	| AReceiveJobReprint;

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

export const doSetJobRefunded = (job, refunded) => async (dispatch, getState) => {
	const state = getState();
	const fetchObject = {
		method: 'PUT',
		headers: standardHeaders(state.auth),
		body: refunded.toString()
	};

	await dispatch(requestJobRefunded(job._id, refunded));

	try {
		const response = await fetch(`${API_URL}/jobs/job/${job._id}/refunded`, fetchObject);
		const json = await response.json();
		await dispatch(receiveJobRefunded(job._id, json.ok));
	} catch (error) {
		handleError(error);
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

export const doJobReprint = (job: PrintJob) => async (dispatch, getState) => {
	const state = getState();
	const fetchObject = {
		method: 'POST',
		headers: standardHeaders(state.auth),
	};

	await dispatch(requestJobReprint(job._id));

	const response = await fetch(`${API_URL}/jobs/${job._id}/reprint`, fetchObject);

	if (!response.ok) {
		handleError(response);
		return;
	}

	const json = await response.json();

	await Promise.all([
		dispatch(receiveJobReprint(job._id, json.ok)),
		dispatch(fetchAccountJobs(state.auth, job.userIdentification)),
		dispatch(fetchQueueJobs(state.auth, job.queueId)),
	]);
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

const fetchAccount = (auth, shortUser) => async dispatch => {
	await dispatch(requestAccount(shortUser));

	const fetchObject = {
		method: 'GET',
		headers: {
			'Accept': 'application/json',
			'Authorization': `Token ${buildToken(auth)}`
		}
	};

	// noinspection JSUnresolvedFunction
	const response = await fetch(`${API_URL}/users/${shortUser}`, fetchObject);

	if (response.status === 401) {
		await dispatch(invalidateAuth()); // To be used for redirection
		return;
	} else if (!response.ok) {
		// TODO: Handle error better
		console.error(response);
		return;
	}

	const json = await response.json();
	await dispatch(receiveAccount(shortUser, json));
};

const shouldFetchAccount = (state, shortUser) => {
	const accounts = state.accounts.items;
	return !Object.keys(accounts).includes(shortUser) || accounts[shortUser].didInvalidate;
};

export const fetchAccountIfNeeded = shortUser => async (dispatch, getState) => {
	const state = getState();
	if (shouldFetchAccount(state, shortUser)) {
		await dispatch(fetchAccount(state.auth, shortUser));
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

const fetchAccountQuota = (auth, shortUser) => async dispatch => {
	await dispatch(requestAccountQuota(shortUser));

	const fetchObject = {
		method: 'GET',
		headers: {
			'Accept': 'application/json',
			'Authorization': `Token ${buildToken(auth)}`
		}
	};

	// noinspection JSUnresolvedFunction
	const response = await fetch(`${API_URL}/users/${shortUser}/quota`, fetchObject);
	if (response.status === 401) {
		await dispatch(invalidateAuth()); // To be used for redirection
		return;
	} else if (!response.ok) {
		// TODO: Handle error better
		handleError(response);
		return;
	}
	const json = await response.json();
	await dispatch(receiveAccountQuota(shortUser, json));
};

const shouldFetchAccountQuota = (state, shortUser) => {
	const accounts = state.accounts.items;
	return Object.keys(accounts).includes(shortUser)
		&& !accounts[shortUser].quota.isFetching && (
			!accounts[shortUser].quota.amount  // Quota is 0; TODO: Expiry time
			|| accounts[shortUser].quota.didInvalidate
		);
};

export const fetchAccountQuotaIfNeeded = shortUser => async (dispatch, getState) => {
	const state = getState();
	if (shouldFetchAccountQuota(state, shortUser)) {
		await dispatch(fetchAccountQuota(state.auth, shortUser));
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

const fetchAccountJobs = (auth, shortUser) => async dispatch => {
	await dispatch(requestAccountJobs(shortUser));
	const fetchObject = {
		method: 'GET',
		headers: {
			'Accept': 'application/json',
			'Authorization': `Token ${buildToken(auth)}`
		}
	};

	// noinspection JSUnresolvedFunction
	const response = await fetch(`${API_URL}/users/${shortUser}/jobs`, fetchObject);

	if (response.status === 401) {
		await dispatch(invalidateAuth()); // To be used for redirection
		return;
	} else if (!response.ok) {
		// TODO: Handle error better
		console.error(response);
		return;
	}
	const json = await response.json();
	await dispatch(receiveAccountJobs(shortUser, json));
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

export const fetchAccountJobsIfNeeded = shortUser => async (dispatch, getState) => {
	const state = getState();
	if (shouldFetchAccountJobs(state, shortUser)) {
		await dispatch(fetchAccountJobs(state.auth, shortUser));
	}
};

export const fetchAccountAndRelatedDataIfNeeded = shortUser => async dispatch => {
	await dispatch(fetchAccountIfNeeded(shortUser));
	await Promise.all([
		dispatch(fetchAccountQuotaIfNeeded(shortUser)),
		dispatch(fetchAccountJobsIfNeeded(shortUser)),
		dispatch(fetchDestinationsIfNeeded()),
	]);
};

function handleError(error) {
	console.log("!!!!!!!!" + error);
}

export const doSetColorPrinting = (shortUser, enabled) => async (dispatch, getState) => {
	const state = getState();
	const fetchObject = {
		method: 'PUT',
		headers: {
			'Content-Type': 'text/plain',
			'Accept': 'application/json',
			'Authorization': `Token ${buildToken(state.auth)}`
		},
		body: enabled.toString()
	};

	try {
		const response = await fetch(`${API_URL}/users/${shortUser}/color`, fetchObject);
		const json = await response.json();  // TODO: Use this or discard it?
		await dispatch(fetchAccount(state.auth, shortUser));
	} catch (error) {
		handleError(error);
	}
};

export const doSetExchangeStatus = (shortUser, exchange) => async (dispatch, getState) => {
	const state = getState();
	const fetchObject = {
		method: 'PUT',
		headers: {
			'Content-Type': 'application/json',
			'Accept': 'application/json',
			'Authorization': `Token ${buildToken(state.auth)}`
		},
		body: exchange.toString()
	};

	try {
		const response = await fetch(`${API_URL}/users/${shortUser}/exchange`, fetchObject);
		const json = await response.json();  // TODO: Use this or discard it?
		await dispatch(fetchAccount(state.auth, shortUser));
	} catch (error) {
		handleError(error);
	}
};

export const doSetNick = (shortUser, salutation) => async (dispatch, getState) => {
	const state = getState();
	const fetchObject = {
		method: 'PUT',
		headers: standardHeaders(state.auth),
		body: salutation
	};

	try {
		const response = await fetch(`${API_URL}/users/${shortUser}/nick`, fetchObject);
		await dispatch(fetchAccount(state.auth, shortUser));
	} catch (error) {
		console.error(error);
	}
};

// Account Actions -------------------------------------------------------------
export type ActionTypesUi = AReceiveUserAutosuggest;

export const RECEIVE_USER_AUTOSUGGEST = 'RECEIVE_USER_AUTOSUGGEST';
interface AReceiveUserAutosuggest {
	type: typeof RECEIVE_USER_AUTOSUGGEST,
	autosuggest: string[],
}
export const receiveUserAutosuggest = (autosuggest): AReceiveUserAutosuggest => ({
	type: RECEIVE_USER_AUTOSUGGEST,
	autosuggest,
});

export const fetchAutoSuggest = (like, limit = 10) => async (dispatch, getState) => {
	const state = getState();
	const fetchObject = {
		method: 'GET',
		headers: standardHeaders(state.auth)
	};

	try {
		const response = await fetch(`${API_URL}/users/autosuggest/${like}?limit=${limit}`, fetchObject);
		const json = await response.json();
		await dispatch(receiveUserAutosuggest(json));
	} catch (error) {
		handleError(error);
	}
};

// Combined Actions ------------------------------------------------------------

export const attemptAuthAndLoadInitialData = credentials => async dispatch => {
	await dispatch(attemptAuth(credentials));
	await dispatch(fetchQueuesIfNeeded());
	await dispatch(fetchAllQueueJobsIfNeeded());
};

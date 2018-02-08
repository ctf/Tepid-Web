import { combineReducers } from 'redux';
import {
	REQUEST_AUTH,
	RECEIVE_AUTH,
	INVALIDATE_AUTH,

	REQUEST_QUEUES,
	RECEIVE_QUEUES,

	REQUEST_DESTINATIONS,
	RECEIVE_DESTINATIONS,

	REQUEST_QUEUE_JOBS,
	RECEIVE_QUEUE_JOBS,

	ADD_JOB,
	REFUND_JOB,

	REQUEST_ACCOUNT,
	RECEIVE_ACCOUNT,

	REQUEST_ACCOUNT_QUOTA,
	RECEIVE_ACCOUNT_QUOTA
} from './actions';

const initialAuthState = {
	isFetching: false,
	didInvalidate: false,
	isAuthenticated: false,
	user: {},
	role: '',
	session: {
		id: null,
		expiration: null
	},
	lastUpdated: null
};

const initialQueuesState = {
	isFetching: false,
	didInvalidate: false,
	items: [],
	jobsByQueue: {},
	lastUpdated: null
};

const initialDestinationsState = {
	isFetching: false,
	didInvalidate: false,
	items: {},
	lastUpdated: null
};

const initialJobsState = {
	isFetching: false,
	didInvalidate: false,
	items: [],
	lastUpdated: null
};

const initialAccountsState = {
	isFetching: false,
	items: {},
	lastUpdated: null
};

const auth = function (state = initialAuthState, action) {
	switch (action.type) {
		case REQUEST_AUTH:
			return Object.assign({}, state, {
				isFetching: true,
				didInvalidate: false
			});
		case RECEIVE_AUTH:
			// TODO: Session expiration
			return Object.assign({}, state, {
				isFetching: false,
				didInvalidate: false,
				isAuthenticated: action.valid,
				user: action.user,
				role: action.role,
				session: {
					id: action.session.id,
					expiration: action.session.expiration
				},
				lastUpdated: action.receivedAt
			});
		case INVALIDATE_AUTH:
			return Object.assign({}, state, {
				didInvalidate: true
			});
		default:
			return state;
	}
};

const queues = function (state = initialQueuesState, action) {
	switch (action.type) {
		case REQUEST_QUEUES:
			return Object.assign({}, state, {
				isFetching: true,
				didInvalidate: false
			});
		case RECEIVE_QUEUES:
			return Object.assign({}, state, {
				isFetching: false,
				didInvalidate: false,
				items: action.queues,
				jobsByQueue: Object.assign({}, ...action.queues.map(queue => ({
					[queue.name]: {
						isFetching: false,
						didInvalidate: false,
						items: []
					}
				}))),
				lastUpdated: action.receivedAt
			});
		case REQUEST_QUEUE_JOBS:
			return Object.assign({}, state, {
				jobsByQueue: {
					...state.jobsByQueue,
					[action.queue]: {
						...state.jobsByQueue[action.queue],
						isFetching: true
					}
				}
			});
		case RECEIVE_QUEUE_JOBS:
			return Object.assign({}, state, {
				jobsByQueue: {
					...state.jobsByQueue,
					[action.queue]: {
						...state.jobsByQueue[action.queue],
						isFetching: false,
						didInvalidate: false,
						items: action.jobs,
						lastUpdated: action.receivedAt
					}
				}
			});
		default:
			return state;
	}
};

const destinations = function (state = initialDestinationsState, action) {
	switch (action.type) {
		case REQUEST_DESTINATIONS:
			return Object.assign({}, state, {
				isFetching: true,
				didInvalidate: false
			});
		case RECEIVE_DESTINATIONS:
			return Object.assign({}, state, {
				isFetching: false,
				didInvalidate: false,
				items: action.destinations,
				lastUpdated: action.receivedAt
			});
		default:
			return state;
	}
};

const jobs = function (state = initialJobsState, action) {
	switch (action.type) {
		case ADD_JOB:
			return Object.assign({}, state, {

			});
		case REFUND_JOB:
			return Object.assign({}, state, {

			});
		default:
			return state;
	}
};

const accounts = function (state = initialAccountsState, action) {
	switch (action.type) {
		case REQUEST_ACCOUNT:
			return Object.assign({}, state, {
				isFetching: true
			});
		case RECEIVE_ACCOUNT:
			return Object.assign({}, state, {
				isFetching: false,
				items: {
					...state.items,
					[action.shortUser]: {
						...state.items[action.shortUser],
						isFetching: false,
						didInvalidate: false,
						data: action.account,
						quota: null,
						jobs: [],
						lastUpdated: action.receivedAt,
						lastUpdatedQuota: -1
					}
				}
			});
		case REQUEST_ACCOUNT_QUOTA:
			return Object.assign({}, state, {
				isFetching: true,
				items: {
					...state.items,
					[action.shortUser]: {
						...state.items[action.shortUser],
						isFetching: true,
						didInvalidate: false
					}
				}
			});
		case RECEIVE_ACCOUNT_QUOTA:
			return Object.assign({}, state, {
				isFetching: false,
				items: {
					...state.items,
					[action.shortUser]: {
						...state.items[action.shortUser],
						isFetching: false,
						didInvalidate: false,
						quota: action.quota,
						lastUpdatedQuota: action.receivedAt
					}
				}
			});
		default:
			return state;
	}
};

const tepidReducer = combineReducers({
	auth,
	queues,
	destinations,
	jobs,
	accounts
});

export default tepidReducer;

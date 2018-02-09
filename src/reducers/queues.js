import {
	REQUEST_QUEUES,
	RECEIVE_QUEUES,

	RECEIVE_QUEUE_JOBS,
	REQUEST_QUEUE_JOBS
} from '../actions';

const initialQueuesState = {
	isFetching: false,
	didInvalidate: false,
	items: [],
	jobsByQueue: {},
	lastUpdated: null
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

export default queues;

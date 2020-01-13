import {
	ActionTypesQueueJobs,
	ActionTypesQueues,
	RECEIVE_PUT_QUEUE,
	RECEIVE_QUEUE_JOBS,
	RECEIVE_QUEUES,
	REQUEST_PUT_QUEUE,
	REQUEST_QUEUE_JOBS,
	REQUEST_QUEUES
} from '../actions';
import {dbObjToIds} from "./helpers";
import {PrintJob, PrintQueue} from "../models";

export interface QueuesState {
	isFetching: boolean,
	didInvalidate: boolean,
	items: Map<string, PrintQueue>,
	jobsByQueue: Map<string, PrintJob[]>,
	lastUpdated: Date | null,
}

const initialQueuesState: QueuesState = {
	isFetching: false,
	didInvalidate: true,
	items: new Map<string, PrintQueue>(),
	jobsByQueue: new Map(),
	lastUpdated: null
};

const queues = function (state = initialQueuesState, action: ActionTypesQueues | ActionTypesQueueJobs) {
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
				jobsByQueue: Object.assign({}, ...Object.keys(action.queues).map(queue => queue && ({
					[queue]: {
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
						items: action.jobs? dbObjToIds(action.jobs) : [],
						lastUpdated: action.receivedAt
					}
				}
			});
		case REQUEST_PUT_QUEUE:
			return state;
		case RECEIVE_PUT_QUEUE: {
			if (action.putResponse.ok && action.putResponse.id !== undefined) {
				return Object.assign({}, state, {
					items: {
						...state.items,
						[action.putResponse.id]: action.newQueue
					}
				})
			} else {
				return state
			}
		}
		default:
			return state;
	}
};

export default queues;

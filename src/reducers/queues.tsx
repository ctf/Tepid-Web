import {
	ActionTypesQueueJobs,
	ActionTypesQueues,
	ModifyAction,
	RECEIVE_MODIFY_QUEUE,
	RECEIVE_QUEUE_JOBS,
	RECEIVE_QUEUES,
	REQUEST_MODIFY_QUEUE,
	REQUEST_QUEUE_JOBS,
	REQUEST_QUEUES,
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

const queues = (
	state = initialQueuesState,
	action: ActionTypesQueues | ActionTypesQueueJobs
): QueuesState => {
	switch (action.type) {
		case REQUEST_QUEUES:
			return {
				...state,
				isFetching: true,
				didInvalidate: false
			};
		case RECEIVE_QUEUES:
			return {
				...state,
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
			};
		case REQUEST_QUEUE_JOBS:
			return {
				...state,
				jobsByQueue: {
					...state.jobsByQueue,
					[action.queue]: {
						...state.jobsByQueue[action.queue],
						isFetching: true
					}
				}
			};
		case RECEIVE_QUEUE_JOBS:
			return {
				...state,
				jobsByQueue: {
					...state.jobsByQueue,
					[action.queue]: {
						...state.jobsByQueue[action.queue],
						isFetching: false,
						didInvalidate: false,
						items: action.jobs ? dbObjToIds(action.jobs) : [],
						lastUpdated: action.receivedAt
					}
				}
			};
		case REQUEST_MODIFY_QUEUE:
			return state;
		case RECEIVE_MODIFY_QUEUE:
			if (action.putResponse.ok && action.putResponse.id !== undefined) {
				if (action.action === ModifyAction.DELETE) {
					const byId = {...state.items};
					delete byId[action.putResponse.id];
					return Object.assign({}, state, {
						items: {
							...byId
						}
					})
				} else {
					return Object.assign({}, state, {
						items: {
							...state.items,
							[action.putResponse.id]: action.newQueue
						}
					})
				}
			} else {
				return state
			}
		default:
			return state;
	}
};

export default queues;

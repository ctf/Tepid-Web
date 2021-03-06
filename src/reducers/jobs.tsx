import {
	ActionTypesAccountJobs,
	ActionTypesJobActions,
	ActionTypesQueueJobs,
	ADD_JOB,
	RECEIVE_ACCOUNT_JOBS,
	RECEIVE_JOB_REFUNDED,
	RECEIVE_QUEUE_JOBS,
	REQUEST_ACCOUNT_JOBS,
	REQUEST_QUEUE_JOBS
} from "../actions";

import {dbObjToSpreadable} from "./helpers";
import {PrintJob} from "../models";

export interface JobsState {
	isFetching: boolean,
	didInvalidate: boolean,
	items: Map<string, PrintJob>,
	allItems: PrintJob[],
	lastUpdated: Date | null,
}

const initialJobsState: JobsState = {
	isFetching: false,
	didInvalidate: false,
	items: new Map<string, PrintJob>(),
	allItems: [],
	lastUpdated: null
};

const updatePrintJobs = (state = initialJobsState, actionItems) => ({
	...state,
	isFetching: false,
	didInvalidate: false,
	items: {...state.items, ...dbObjToSpreadable(actionItems)}
});

const jobs = (
	state = initialJobsState,
	action: ActionTypesJobActions | ActionTypesQueueJobs | ActionTypesAccountJobs
): JobsState => {
	switch (action.type) {
		case ADD_JOB:
			// TODO
			return state;
		case RECEIVE_JOB_REFUNDED:
			if (!action.ok) return state;
			const job = state.items[action.jobId];
			const newRefundedStatus = action.ok ? !job.refunded : job.refunded;

			return {
				...state,
				items: {
					...state.items,
					[action.jobId]: {
						...job,
						refunded:newRefundedStatus
					}
				}
			};

		case REQUEST_QUEUE_JOBS:
			return Object.assign({}, state, {
				isFetching: true
			});

		case RECEIVE_QUEUE_JOBS:
			return updatePrintJobs(state, action.jobs);

		case REQUEST_ACCOUNT_JOBS:
			return {
				...state,
				isFetching: true
			};

		case RECEIVE_ACCOUNT_JOBS:
			return updatePrintJobs(state, action.jobs);

		default:
			return state;
	}
};

export default jobs

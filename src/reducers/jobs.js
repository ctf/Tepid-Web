import {
	ADD_JOB,
	RECEIVE_ACCOUNT_JOBS,
	RECEIVE_JOB_REFUNDED,
	RECEIVE_QUEUE_JOBS,
	REQUEST_ACCOUNT_JOBS,
	REQUEST_QUEUE_JOBS
} from "../actions";

import {dbObjToSpreadable} from "./helpers";

const initialJobsState = {
	isFetching: false,
	didInvalidate: false,
	items: {},
	allItems: [],
	lastUpdated: null
};

const updatePrintJobs = function (state = initialJobsState, actionItems) {
	console.log('q1', state);
	console.log('q2', dbObjToSpreadable(actionItems));
	return Object.assign({}, state, {
		isFetching: false,
		didInvalidate: false,
		items: Object.assign({}, state.items,  dbObjToSpreadable(actionItems))
	})
};

const jobs = function (state = initialJobsState, action) {
	switch (action.type) {
		case ADD_JOB:
			return Object.assign({}, state, {

			});
		case RECEIVE_JOB_REFUNDED:{
			return Object.assign({}, state, {

			});
		}
		case REQUEST_QUEUE_JOBS:{
			return Object.assign({}, state, {
				isFetching: true
			})
		}

		case RECEIVE_QUEUE_JOBS:{
			return updatePrintJobs(state, action.items);
		}

		case REQUEST_ACCOUNT_JOBS:{
			return Object.assign({}, state, {
				isFetching: true
			})
		}

		case RECEIVE_ACCOUNT_JOBS:{
			console.log(dbObjToSpreadable(action.jobs));
			return updatePrintJobs(state, action.jobs);
		}

		default:
			return state;
	}
};

export default jobs
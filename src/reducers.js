import { combineReducers } from 'redux';
import {
	ADD_JOB,
	REFUND_JOB,
} from './actions';

import auth from './reducers/auth';
import queues from './reducers/queues';
import destinations from './reducers/destinations';
import accounts from './reducers/accounts';

const initialJobsState = {
	isFetching: false,
	didInvalidate: false,
	items: [],
	lastUpdated: null
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

const tepidReducer = combineReducers({
	auth,
	queues,
	destinations,
	jobs,
	accounts
});

export default tepidReducer;

import { combineReducers } from 'redux';

import auth from './reducers/auth';
import queues from './reducers/queues';
import destinations from './reducers/destinations';
import accounts from './reducers/accounts';
import jobs from "./reducers/jobs";

const tepidReducer = combineReducers({
	auth,
	queues,
	destinations,
	jobs: jobs,
	accounts
});

export default tepidReducer;

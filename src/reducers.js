import { combineReducers } from 'redux';

import auth from './reducers/auth';
import queues from './reducers/queues';
import destinations from './reducers/destinations';
import accounts from './reducers/accounts';
import jobs from "./reducers/jobs";
import ui from "./reducers/ui";

const tepidReducer = combineReducers({
	auth,
	queues,
	destinations,
	jobs,
	accounts,
	ui,
});

export default tepidReducer;

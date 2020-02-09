import {combineReducers} from 'redux';

import auth from './reducers/auth';
import queues from './reducers/queues';
import destinations from './reducers/destinations';
import accounts from './reducers/accounts';
import jobs from "./reducers/jobs";
import semesters from "./reducers/semesters";
import ui from "./reducers/ui";
import {RECEIVE_INVALIDATE_AUTH, REQUEST_INVALIDATE_AUTH} from "./actions";
import storage from 'redux-persist/lib/storage'

const tepidReducer = combineReducers({
	auth: auth,
	queues: queues,
	destinations: destinations,
	jobs: jobs,
	accounts: accounts,
	semesters: semesters,
	ui: ui,
});

const rootReducer = (state, action) => {
	if (action.type === REQUEST_INVALIDATE_AUTH || action.type === RECEIVE_INVALIDATE_AUTH) {
		state = undefined;
		storage.removeItem('persist:root');
	}

	return tepidReducer(state, action);
};

export default rootReducer;
export type RootState = ReturnType<typeof rootReducer>

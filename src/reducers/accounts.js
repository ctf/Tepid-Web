import {
	REQUEST_ACCOUNT,
	RECEIVE_ACCOUNT,

	REQUEST_ACCOUNT_QUOTA,
	RECEIVE_ACCOUNT_QUOTA,

	REQUEST_ACCOUNT_JOBS,
	RECEIVE_ACCOUNT_JOBS
} from '../actions';
import {dbObjToIds} from "./helpers";

const initialAccountsState = {
	isFetching: false,
	items: {},
	lastUpdated: null
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
						quota: {
							amount: null,
							max: null,
							isFetching: false,
							didInvalidate: false,
							lastUpdated: -1
						},
						jobs: {
							items: [],
							isFetching: false,
							didInvalidate: false,
							lastUpdated: -1
						},
						lastUpdated: action.receivedAt
					}
				}
			});
		case REQUEST_ACCOUNT_QUOTA:
			return Object.assign({}, state, {
				items: {
					...state.items,
					[action.shortUser]: {
						...state.items[action.shortUser],
						quota: {
							...state.items[action.shortUser].quota,
							isFetching: true,
							didInvalidate: false
						}
					}
				}
			});
		case RECEIVE_ACCOUNT_QUOTA:
			return Object.assign({}, state, {
				items: {
					...state.items,
					[action.shortUser]: {
						...state.items[action.shortUser],
						quota: {
							...state.items[action.shortUser].quota,
							amount: action.quota,
							isFetching: false,
							didInvalidate: false,
							lastUpdated: action.receivedAt
						}
					}
				}
			});
		case REQUEST_ACCOUNT_JOBS:
			return Object.assign({}, state, {
				items: {
					...state.items,
					[action.shortUser]: {
						...state.items[action.shortUser],
						jobs: {
							...state.items[action.shortUser].jobs,
							isFetching: true,
							didInvalidate: false
						}
					}
				}
			});
		case RECEIVE_ACCOUNT_JOBS:
			return Object.assign({}, state, {
				items: {
					...state.items,
					[action.shortUser]: {
						...state.items[action.shortUser],
						jobs: {
							...state.items[action.shortUser].jobs,
							items: dbObjToIds(action.jobs),
							isFetching: false,
							didInvalidate: false,
							lastUpdated: action.receivedAt
						}
					}
				}
			});
		default:
			return state;
	}
};

export default accounts;

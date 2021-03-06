import {
	REQUEST_ACCOUNT,
	RECEIVE_ACCOUNT,

	REQUEST_ACCOUNT_QUOTA,
	RECEIVE_ACCOUNT_QUOTA,

	REQUEST_ACCOUNT_JOBS,
	RECEIVE_ACCOUNT_JOBS,

	ActionTypesAccounts,
	ActionTypesAccountJobs,
} from '../actions';
import {dbObjToIds} from "./helpers";
import {PrintJob, User} from "../models";

interface UserContainer {
	isFetching: boolean,
	didInvalidate: boolean,
	data: User,
	quota: QuotaState,
	jobs: JobsState,
	lastUpdated: Date | null,
}

export interface AccountsState {
	isFetching: boolean,
	items: Map<string, UserContainer>,
	lastUpdated: Date | null,
}

const initialAccountsState: AccountsState = {
	isFetching: false,
	items: new Map<string, UserContainer>(),
	lastUpdated: null
};

export interface QuotaState {
	amount: number | null,
	max: number | null,
	isFetching: boolean,
	didInvalidate: boolean,
	lastUpdated: Date | null,
}

const initialQuotaState : QuotaState = {
	amount: null,
	max: null,
	isFetching: false,
	didInvalidate: false,
	lastUpdated: null
};

export interface JobsState {
	items: PrintJob[],
	isFetching: boolean,
	didInvalidate: boolean,
	lastUpdated: Date | null,
}

const initialJobsState: JobsState = {
	items: [],
	isFetching: false,
	didInvalidate: false,
	lastUpdated: null
};

const accounts = (
	state = initialAccountsState,
	action: ActionTypesAccounts | ActionTypesAccountJobs
): AccountsState => {
	switch (action.type) {
		case REQUEST_ACCOUNT:
			return {
				...state,
				isFetching: true
			};
		case RECEIVE_ACCOUNT:
			return {
				...state,
				isFetching: false,
				items: {
					...state.items,
					[action.shortUser]: {
						...state.items[action.shortUser],
						isFetching: false,
						didInvalidate: false,
						data: action.account,
						quota: state.items[action.shortUser] ? state.items[action.shortUser].quota : initialQuotaState,
						jobs: state.items[action.shortUser] ? state.items[action.shortUser].jobs : initialJobsState,
						lastUpdated: action.receivedAt
					}
				}
			};
		case REQUEST_ACCOUNT_QUOTA:
			return {
				...state,
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
			};
		case RECEIVE_ACCOUNT_QUOTA:
			return {
				...state,
				items: {
					...state.items,
					[action.shortUser]: {
						...state.items[action.shortUser],
						quota: {
							...state.items[action.shortUser].quota,
							amount: action.quota.quota,
							max: action.quota.maxQuota,
							isFetching: false,
							didInvalidate: false,
							lastUpdated: action.receivedAt
						}
					}
				}
			};
		case REQUEST_ACCOUNT_JOBS:
			return {
				...state,
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
			};
		case RECEIVE_ACCOUNT_JOBS:
			return {
				...state,
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
			};
		default:
			return state;
	}
};

export default accounts;

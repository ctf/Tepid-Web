import {ActionTypesAuth, ActionTypesInvalidateAuth, RECEIVE_AUTH, REQUEST_AUTH} from '../actions';
import {Session, User} from "../models";

export interface AuthState {
	isFetching: boolean,
	didInvalidate: boolean,
	isAuthenticated: boolean,
	user: User,
	role: string,
	session: {
		id: string | null,
		expiration
	}
	lastUpdated: Date | null,
}

const initialAuthState : AuthState = {
	isFetching: false,
	didInvalidate: false,
	isAuthenticated: false,
	user: {},
	role: '',
	session: {
		id: null,
		expiration: null
	},
	lastUpdated: null
};

const auth = function (state = initialAuthState, action: ActionTypesAuth | ActionTypesInvalidateAuth) {
	switch (action.type) {
		case REQUEST_AUTH:
			return Object.assign({}, state, {
				isFetching: true,
				didInvalidate: false
			});
		case RECEIVE_AUTH:
			// TODO: Session expiration
			return Object.assign({}, state, {
				isFetching: false,
				didInvalidate: false,
				isAuthenticated: action.valid,
				user: action.user,
				role: action.role,
				session: {
					id: action.session.id,
					expiration: action.session.expiration
				},
				lastUpdated: action.receivedAt
			});
		default:
			return state;
	}
};

export default auth;

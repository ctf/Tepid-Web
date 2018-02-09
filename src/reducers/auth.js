import {INVALIDATE_AUTH, RECEIVE_AUTH, REQUEST_AUTH} from '../actions';

const initialAuthState = {
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

const auth = function (state = initialAuthState, action) {
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
		case INVALIDATE_AUTH:
			return Object.assign({}, state, {
				didInvalidate: true
			});
		default:
			return state;
	}
};

export default auth;

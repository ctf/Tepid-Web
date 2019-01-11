import {INVALIDATE_AUTH, RECEIVE_AUTH, REQUEST_AUTH} from '../actions';

interface User {
    shortUser: string
    // TODO verify
    token: string
}

interface Session {
    id: string
    expiration: number
}

/**
 * User and session should probably be merged?
 * Unless one can be null without the other being null
 * Currently, may be useful to keep user with null session
 * if we can retain the email/sam
 *
 * Role should probably be part of session?
 */
interface AuthState {
    isFetching: boolean
    didInvalidate: boolean
    isAuthenticated: boolean
    user: User | null
    role: string
    session: Session | null
    lastUpdated: number | null
}

const initialAuthState: AuthState = {
    isFetching: false,
    didInvalidate: false,
    isAuthenticated: false,
    user: null,
    role: '',
    session: null,
    lastUpdated: null
};

interface Action {
    type: string
}

// TODO update action type
const auth = function (state: AuthState = initialAuthState, action: Action | any) {
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

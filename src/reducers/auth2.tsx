import {INVALIDATE_AUTH, RECEIVE_AUTH, REQUEST_AUTH} from '../actions';

const enum ActionType {
    A = "", B = "", C = ""
}

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

interface UpdateAction {
    type: "UPDATE_ACTION",
    value: string;
}

interface RemoveAction {
    type: "REMOVE_ACTION",
    index: number;
}

type Action2 = UpdateAction | RemoveAction;

// our switch cases know the type now
const reducer = (state: any, action: Action2) => {
    switch (action.type) {
        case "UPDATE_ACTION":
            // recognizes "value" and that it is a string
            action.value
            break;
        case "REMOVE_ACTION":
            // recognizes "index" and that it is a number
            action.index
            break;
    }
}

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

import {ActionType} from "typesafe-actions";
import * as actions from './actions'
import {LOGIN, LOGOUT} from "./constants";
import {Session, User} from "./models";
import {combineReducers} from "redux";

export type AuthState = Readonly<{
    user?: User
    session?: Session
}>;

export type AuthAction = ActionType<typeof actions>;

// TODO this isn't correct
export default combineReducers<AuthState, AuthAction>({
    user: (state = undefined, action) => {
        switch (action.type) {
            case LOGIN:
                return {...<User>state};
            case LOGOUT:
                return undefined;
            default:
                return state;
        }
    }
});

import {RootAction} from 'TepidTypes';
import {combineReducers} from 'redux';
import {getType} from 'typesafe-actions';

import * as actions from './actions';
import {AuthUser} from "../../api/models/user";
import {Session} from "../../api/models/auth";

export type AuthState = Readonly<{
    user: AuthUser | null,
    session: Session | null
}>;

export default combineReducers<AuthState, RootAction>({
    session: (state = null, action) => {
        switch (action.type) {
            case getType(actions.loginAsync.success):
                return action.payload;
            case getType(actions.loginAsync.failure):
                return null;
            default:
                return state;
        }
    },
    user: (state = null, action) => {
        switch (action.type) {
            case getType(actions.logoutAsync.success):
                return null;
            default:
                return state;
        }
    }
});

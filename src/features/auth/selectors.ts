import {AuthState} from "./reducers";

export const getUser = (state: AuthState) => state.user;
export const getSession = (state: AuthState) => state.session;
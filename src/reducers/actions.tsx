import {createAction} from 'typesafe-actions'
import {LoginRequest} from "./state";

export const login = createAction(TepidAction.LoginAction, resolve => {
    return (user: string, password: string) => resolve({user, password} as LoginRequest)
});

export const enum TepidAction {
    LoginAction = "tepid/LOGIN"
}
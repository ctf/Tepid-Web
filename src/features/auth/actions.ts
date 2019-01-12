import {createAsyncAction} from 'typesafe-actions';
import {LoginRequest, Session} from "../../api/models/auth";

export const loginAsync = createAsyncAction(
    'LOGIN_REQUEST',
    'LOGIN_SUCCESS',
    'LOGIN_FAILURE'
)<LoginRequest, Session, string>();

export const logoutAsync = createAsyncAction(
    'LOGOUT_REQUEST',
    'LOGOUT_SUCCESS',
    'LOGOUT_FAILURE'
)<void, boolean, string>();

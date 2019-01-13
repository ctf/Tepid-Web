import {LoginRequest, Session} from "../../api/models/auth";
import {TepidAction} from "../constants";
import {createTepidAsyncAction} from "../utils";

export const loginAsync = createTepidAsyncAction(
    TepidAction.LoginRequest,
    TepidAction.LoginSuccess,
    TepidAction.LoginFailure
)<LoginRequest, Session, string>();

export const logoutAsync = createTepidAsyncAction(
    TepidAction.LoginRequest,
    TepidAction.LogoutSuccess,
    TepidAction.LoginFailure
)<void, void, string>();

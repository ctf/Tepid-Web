import {action, createStandardAction} from "typesafe-actions";
import {LOGIN, LOGOUT} from "./constants";
import {LoginRequest} from "./models";
import {EmptyAction, NoArgCreator} from "typesafe-actions/dist/types";

export const login = createStandardAction(LOGIN)<LoginRequest>();

export const logout = createStandardAction(LOGOUT)<void>();
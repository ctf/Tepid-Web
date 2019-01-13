import {User} from "../../api/models/user";
import {TepidAction} from "../constants";
import {createTepidAsyncAction} from "../utils";

export const getUserAsync = createTepidAsyncAction(
    TepidAction.UserRequest,
    TepidAction.UserSuccess,
    TepidAction.UserFailure
)<string, User, string>();


export const getQuotaAsync = createTepidAsyncAction(
    TepidAction.QuotaRequest,
    TepidAction.QuotaSuccess,
    TepidAction.QuotaFailure
)<string, number, string>();
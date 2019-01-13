import {CreateAsyncAction} from "typesafe-actions/src/create-async-action";
import {TepidAction} from "./constants";
import {createAsyncAction} from "typesafe-actions";
import {Epic} from "redux-observable";
import {RootAction, RootService, RootState} from "TepidTypes";

export function createTepidAsyncAction<T1 extends TepidAction,
    T2 extends TepidAction,
    T3 extends TepidAction>(
    requestType: T1,
    successType: T2,
    failureType: T3
): CreateAsyncAction<T1, T2, T3> {
    return createAsyncAction(requestType, successType, failureType)
}

export type RootEpic = Epic<RootAction, RootAction, RootState, RootService>

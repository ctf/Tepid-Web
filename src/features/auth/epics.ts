import {RootAction, RootService, RootState} from "TepidTypes";
import {isActionOf} from "typesafe-actions";
import {Epic} from "redux-observable";
import {from, of} from "rxjs";
import {catchError, filter, map, switchMap} from "rxjs/operators";

import {loginAsync, logoutAsync} from "./actions";

export const loginEpic: Epic<RootAction,
    RootAction,
    RootState,
    RootService> = (action$, state$, api) =>
    action$.pipe(
        filter(isActionOf(loginAsync.request)),
        switchMap(action =>
            from(api.login(action.payload)).pipe(
                map(loginAsync.success),
                catchError((message: string) => of(loginAsync.failure(message)))
            )
        )
    );

export const logoutEpic: Epic<RootAction,
    RootAction,
    RootState,
    RootService> = (action$, state$, api) =>
    action$.pipe(
        filter(isActionOf(logoutAsync.request)),
        switchMap(() =>
            from(api.logout()).pipe(
                map(logoutAsync.success),
                catchError((message: string) => of(logoutAsync.failure(message)))
            )
        )
    );

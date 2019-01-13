import {isActionOf} from "typesafe-actions";
import {from, of} from "rxjs";
import {catchError, filter, map, switchMap} from "rxjs/operators";

import {loginAsync, logoutAsync} from "./actions";
import {RootEpic} from "../utils";

export const loginEpic: RootEpic = (action$, state$, api) =>
    action$.pipe(
        filter(isActionOf(loginAsync.request)),
        switchMap(action =>
            from(api.login(action.payload)).pipe(
                map(loginAsync.success),
                catchError((message: string) => of(loginAsync.failure(message)))
            )
        )
    );

export const logoutEpic: RootEpic = (action$, state$, api) =>
    action$.pipe(
        filter(isActionOf(logoutAsync.request)),
        switchMap(() =>
            from(api.logout()).pipe(
                map(logoutAsync.success),
                catchError((message: string) => of(logoutAsync.failure(message)))
            )
        )
    );

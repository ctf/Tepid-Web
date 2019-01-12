import {fetchJobs, loadJobsAsync} from './actions'
import {Epic} from "redux-observable";
import {RootAction, RootService, RootState} from "TepidTypes";
import {from, of} from 'rxjs'
import {filter, switchMap, map, catchError} from 'rxjs/operators'
import {isActionOf} from "typesafe-actions";

const loadJobsEpic: Epic<RootAction,
    RootAction,
    RootState,
    RootService> = (action$, state$, api) =>
    action$.pipe(
        filter(isActionOf(loadJobsAsync.request)),
        switchMap(() =>
            // TODO
        from(api.printJobs.load("test")).pipe(
            map(loadJobsAsync.success),
            catchError((message: string) => of(loadJobsAsync.failure(message)))
        ))
    )
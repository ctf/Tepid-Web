import {authReducer as reducer} from './'

import api from "../../api";
import {loginAsync} from "./actions";
import {ActionsObservable} from "redux-observable";
import {loginEpic} from "./epics";
import {createStore} from "redux";
import rootReducer from "../../store/root-reducer";
import {Session} from "../../api/models/auth";
import {of, throwError} from "rxjs";

const initialState = reducer(undefined, {} as any);

const loginObservable = () => ActionsObservable.of(
    loginAsync.request({user: "testUser", password: "testPassword"})
);

describe('Auth Login', () => {
    it('should be empty in initial state', () => {
        expect(initialState).toMatchObject({})
    });
    it('should receive session from login request', (done) => {

        const response: Session = {
            id: "testId",
            token: "testToken",
            expiration: 1000
        };

        const expected = loginAsync.success(response);

        const action$ = loginObservable();

        jest.spyOn(api, 'login')
            .mockImplementation(() => of(response));

        loginEpic(action$, createStore(rootReducer, {}), api)
            .subscribe((actual: any) => {
                    expect(actual).toEqual(expected);
                    done()
                }
            );

    });
    it('should receive error message from error login response', (done) => {
        const error = 'failed to log in';

        jest.spyOn(api, 'login')
            .mockImplementation(() => throwError(error));

        const expected = loginAsync.failure(error);

        const action$ = loginObservable();

        loginEpic(action$, createStore(rootReducer, {}), api)
            .subscribe((actual: any) => {
                    expect(actual).toEqual(expected);
                    done();
                }
            );
    });
});
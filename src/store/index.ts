import {RootAction, RootState, RootService} from "TepidTypes";
import {applyMiddleware, compose, createStore} from "redux";
import {createEpicMiddleware} from "redux-observable";

import rootReducer from './root-reducer'
import rootEpic from './root-epic'
import rootService from '../api/index'

const composeEnhancers =
    (window && window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__) || compose;

export const epicMiddleware = createEpicMiddleware<RootAction,
    RootAction,
    RootState,
    RootService>({
    dependencies: rootService
});

const middlewares = [epicMiddleware];

const enhancer = composeEnhancers(applyMiddleware(...middlewares));

const initialState = {};

const store = createStore(rootReducer, initialState, enhancer);

epicMiddleware.run(rootEpic);

// Singleton store instance using api
export default store;
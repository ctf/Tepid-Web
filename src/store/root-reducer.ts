import {combineReducers} from "redux";
import {routerReducer} from 'react-router-redux'
import {authReducer} from '../features/auth'

const rootReducer = combineReducers({
    router: routerReducer,
    auth: authReducer
});

export default rootReducer;
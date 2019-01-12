import {createStore, applyMiddleware} from "redux";
import {composeEnhancers} from "./utils";
import rootReducer from './root-reducer';


function configureStore(initialState?: object) {

    // const enhancer = composeEnhancers()

    return createStore(rootReducer, initialState!)
}

const store = configureStore();

export default store;
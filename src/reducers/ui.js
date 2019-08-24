import {RECEIVE_USER_AUTOSUGGEST} from "../actions";

const initialState = {
	autosuggest:[],
};

const ui = function(state=initialState, action){
	switch(action.type){
		case RECEIVE_USER_AUTOSUGGEST:
			return Object.assign({}, state, {
				autosuggest: action.autosuggest
			});
		default:
			return state;

	}
};

export default ui;
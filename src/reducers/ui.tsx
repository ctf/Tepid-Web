import {ActionTypesUi, RECEIVE_USER_AUTOSUGGEST} from "../actions";

export interface UiState {
	autosuggest: string[]
}

const initialState: UiState = {
	autosuggest:[],
};

const ui = function(state=initialState, action: ActionTypesUi){
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
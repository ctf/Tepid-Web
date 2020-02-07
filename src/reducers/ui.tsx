import {ActionTypesUi, RECEIVE_USER_AUTOSUGGEST} from "../actions";

export interface UiState {
	autosuggest: string[]
}

const initialState: UiState = {
	autosuggest: [],
};

const ui = (
	state = initialState,
	action: ActionTypesUi
): UiState => {
	switch (action.type) {
		case RECEIVE_USER_AUTOSUGGEST:
			return {
				...state,
				autosuggest: action.autosuggest
			};
		default:
			return state;

	}
};

export default ui;

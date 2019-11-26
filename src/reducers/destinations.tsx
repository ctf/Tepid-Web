import {CONFIRM_DESTINATION_TICKET, RECEIVE_DESTINATIONS, REQUEST_DESTINATIONS} from '../actions';
import {Destination} from "../models";

export interface DestinationsState {
	isFetching: boolean,
	didInvalidate: boolean,
	items: Map<string, Destination>,
	lastUpdated: Date | null,
}

const initialDestinationsState : DestinationsState = {
	isFetching: false,
	didInvalidate: false,
	items: new Map<string, Destination>(),
	lastUpdated: null
};

const destinations = function (state = initialDestinationsState, action) {
	switch (action.type) {
		case REQUEST_DESTINATIONS:
			return Object.assign({}, state, {
				isFetching: true,
				didInvalidate: false
			});
		case RECEIVE_DESTINATIONS:
			return Object.assign({}, state, {
				isFetching: false,
				didInvalidate: false,
				items: action.destinations,
				lastUpdated: action.receivedAt
			});
		case CONFIRM_DESTINATION_TICKET:
			return Object.assign({}, state, {
				items: {
					...state.items,
					[action.destination.name]:{
						...state.items[action.destination.name],
						ticket:action.ticket,
						up:action.up,
					}
				}
			});
		default:
			return state;
	}
};

export default destinations;

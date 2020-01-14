import {
	ActionTypesDestinations,
	ActionTypesTickets,
	CONFIRM_DESTINATION_TICKET,
	ModifyAction,
	RECEIVE_DESTINATIONS,
	RECEIVE_MODIFY_DESTINATION,
	REQUEST_DESTINATIONS,
	REQUEST_MODIFY_DESTINATION
} from '../actions';
import {Destination} from "../models";

export interface DestinationsState {
	isFetching: boolean,
	didInvalidate: boolean,
	items: Map<string, Destination>,
	lastUpdated: Date | null,
}

const initialDestinationsState: DestinationsState = {
	isFetching: false,
	didInvalidate: false,
	items: new Map<string, Destination>(),
	lastUpdated: null
};

const destinations = function (state = initialDestinationsState, action: ActionTypesDestinations | ActionTypesTickets) {
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
			if (action.destination.name) {
				return Object.assign({}, state, {
					items: {
						...state.items,
						[action.destination.name]: {
							...state.items[action.destination.name],
							ticket: action.ticket,
							up: action.up,
						}
					}
				})
			} else {
				return state
			}
		case REQUEST_MODIFY_DESTINATION:
			return state;
		case RECEIVE_MODIFY_DESTINATION: {
			if (action.putResponse.ok && action.putResponse.id !== undefined) {
				if (action.action === ModifyAction.DELETE) {
					const byId = {...state.items};
					delete byId[action.putResponse.id];
					return Object.assign({}, state, {
						items: {
							...byId
						}
					})
				} else {
					return Object.assign({}, state, {
						items: {
							...state.items,
							[action.putResponse.id]: action.newDestination
						}
					})
				}
			} else {
				return state
			}
		}
		default:
			return state;
	}
};

export default destinations;

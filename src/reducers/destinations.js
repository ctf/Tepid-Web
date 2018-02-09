import {RECEIVE_DESTINATIONS, REQUEST_DESTINATIONS} from '../actions';

const initialDestinationsState = {
	isFetching: false,
	didInvalidate: false,
	items: {},
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
		default:
			return state;
	}
};

export default destinations;

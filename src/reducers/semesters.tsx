import {Semester} from "../models";
import {RECEIVE_ACCOUNT, RECEIVE_SEMESTERS} from "../actions";


interface SemesterContainer {
	granted: Semester[]
	enrolled: Semester[]
}

export interface SemesterState {
	isFetching: boolean,
	items: Map<string, SemesterContainer>
	didInvalidate: boolean,
	lastUpdated: Date | null,
}

const initialSemesterState: SemesterState = {
	items: new Map(),
	isFetching: false,
	didInvalidate: false,
	lastUpdated: null,
};

const semesters = (
	state = initialSemesterState,
	action: any
): SemesterState => {
	switch (action.type) {
		case RECEIVE_SEMESTERS: {
			return {
				...state,
				items: {
					...state.items,
					[action.shortUser]: {
						...state.items[action.shortUser],
						[action.params?.queryfor ?? "granted"]: action.retrieved_semesters
					}
				}
			}
		}
		default:
			return state;
	}
};

export default semesters

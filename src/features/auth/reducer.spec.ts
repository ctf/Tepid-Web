import {authReducer as reducer} from './'

const initialState = reducer(undefined, {} as any);

// TODO
describe('Auth Login', () => {
    describe('initial state', () => {
        it('should match', () => {
            expect(initialState).toMatchObject({})
        })
    })
});
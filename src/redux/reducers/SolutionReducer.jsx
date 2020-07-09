import { ALL_SOLUTION, NEW_SOLUTION, REMOVE_ALL_SOLUTION } from '../types/Type'

export default (state = [], action = {}) => {
    switch (action.type) {
        case ALL_SOLUTION: return action.payload
        case NEW_SOLUTION: return state.concat(action.payload)
        case REMOVE_ALL_SOLUTION: return []
        default: return state
    }
}
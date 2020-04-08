import { ALL_PROBLEM, NEW_PROBLEM } from '../types/Type'

export default (state = [], action = {}) => {
    switch (action.type) {
        case ALL_PROBLEM: return action.payload
        case NEW_PROBLEM: return action.payload
        default: return state
    }
}
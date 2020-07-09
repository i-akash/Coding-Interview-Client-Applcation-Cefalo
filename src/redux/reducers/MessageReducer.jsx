import { ALL_MESSAGE, NEW_MESSAGE, REMOVE_ALL_MESSAGE } from '../types/Type'

export default (state = [], action = {}) => {
    switch (action.type) {
        case ALL_MESSAGE: return action.payload
        case NEW_MESSAGE: return state.concat(action.payload)
        case REMOVE_ALL_MESSAGE: return []
        default: return state
    }
}
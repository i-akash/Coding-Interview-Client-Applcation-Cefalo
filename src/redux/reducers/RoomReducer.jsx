import { ROOM_INFO, NEW_ROOM_INFO } from "../types/Type";

export default (state = {}, action = {}) => {
  switch (action.type) {
    case ROOM_INFO:
      return action.payload;
    case NEW_ROOM_INFO:
      return action.payload;
    default:
      return state;
  }
};

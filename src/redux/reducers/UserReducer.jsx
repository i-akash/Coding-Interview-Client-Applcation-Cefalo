import { USER_INFO } from "../types/Type";

export default (state = {}, action = {}) => {
  switch (action.type) {
    case USER_INFO:
      return action.payload;
    default:
      return state;
  }
};

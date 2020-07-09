import {
  NEW_MESSAGE_NOTIFY,
  SEEN_MESSAGE_NOTIFY,
  NEW_SOLUTION_NOTIFY,
  SEEN_SOLUTION_NOTIFY,
  NEW_PROBLEM_NOTIFY,
  SEEN_PROBLEM_NOTIFY,
} from "../types/Type";

export default (
  state = { message: 0, solution: 0, problem: 0 },
  action = {}
) => {
  switch (action.type) {
    case NEW_MESSAGE_NOTIFY:
      return { ...state, message: state.message + 1 };
    case SEEN_MESSAGE_NOTIFY:
      return { ...state, message: 0 };
    case NEW_SOLUTION_NOTIFY:
      return { ...state, solution: state.solution + 1 };
    case SEEN_SOLUTION_NOTIFY:
      return { ...state, solution: 0 };
    case NEW_PROBLEM_NOTIFY:
      return { ...state, problem: state.problem + 1 };
    case SEEN_PROBLEM_NOTIFY:
      return { ...state, problem: 0 };
    default:
      return state;
  }
};

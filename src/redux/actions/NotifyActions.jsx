import {
  NEW_MESSAGE_NOTIFY,
  SEEN_MESSAGE_NOTIFY,
  NEW_SOLUTION_NOTIFY,
  SEEN_SOLUTION_NOTIFY,
  NEW_PROBLEM_NOTIFY,
  SEEN_PROBLEM_NOTIFY,
} from "../types/Type";

export const messageArriveNotifyAction = () => ({
  type: NEW_MESSAGE_NOTIFY,
  payload: {},
});

export const seenMessageNotifyAction = () => ({
  type: SEEN_MESSAGE_NOTIFY,
  payload: {},
});

export const solutionArriveNotifyAction = () => ({
  type: NEW_SOLUTION_NOTIFY,
  payload: {},
});

export const seenSolutionNotifyAction = () => ({
  type: SEEN_SOLUTION_NOTIFY,
  payload: {},
});

export const problemArriveNotifyAction = () => ({
  type: NEW_PROBLEM_NOTIFY,
  payload: {},
});

export const seenProblemNotifyAction = () => ({
  type: SEEN_PROBLEM_NOTIFY,
  payload: {},
});

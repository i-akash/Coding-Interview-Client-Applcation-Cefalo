import { combineReducers } from "redux";
import Messages from "./MessageReducer";
import Problems from "./ProblemReducer";
import Solutions from "./SolutionReducer";
import Notifications from "./NotifyReducer";

export default combineReducers({
  Messages,
  Problems,
  Solutions,
  Notifications,
});

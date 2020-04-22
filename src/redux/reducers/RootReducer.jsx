import { combineReducers } from "redux";
import Messages from "./MessageReducer";
import Problems from "./ProblemReducer";
import Solutions from "./SolutionReducer";
import Notifications from "./NotifyReducer";
import Room from "./RoomReducer";
import User from "./UserReducer";

export default combineReducers({
  User,
  Room,
  Messages,
  Problems,
  Solutions,
  Notifications,
});

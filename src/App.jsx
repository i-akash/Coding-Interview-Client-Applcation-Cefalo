import React from "react";

import ChatPage from "./components/pages/chat/ChatPage";
import LoginPage from "./components/pages/login/LoginPage";
import socketClient from "./sockets/SocketClient";

//redux
import { connect } from "react-redux";

//action
import {
  allMessageAction,
  newMessageAction,
  removeAllMessageAction,
} from "./redux/actions/ChatActions";
import {
  newProblemAction,
  allProblemAction,
} from "./redux/actions/ProblemActions";
import {
  newSolutionAction,
  allSolutionAction,
  removeAllSolutionAction,
} from "./redux/actions/SolutionActions";
import {
  NEW_MESSAGE,
  NEW_PROBLEM,
  NEW_SOLUTION,
  ALL_MESSAGE,
  ALL_PROBLEM,
  ALL_SOLUTION,
  REMOVE_ALL_MESSAGES,
  REMOVE_ALL_SOLUTION,
  ROOM_INFO,
  CHANGE_ROOM_INFO,
  KICK_OUT,
} from "./sockets/EventType";
import {
  messageArriveNotifyAction,
  problemArriveNotifyAction,
  solutionArriveNotifyAction,
} from "./redux/actions/NotifyActions";
import {
  getRoomInfoAction,
  newRoomInfoAction,
} from "./redux/actions/RoomActions";
import { USER_INFO } from "./redux/types/Type";

class App extends React.Component {
  state = {
    page: 1,
  };
  componentDidMount = () => {
    let { userInfo, roomPassword } = this.getStorageInfo();
    if (!!userInfo.userName && !!userInfo.userRole && !!userInfo.userRoom) {
      this.setState({ page: 2 });
      socketClient.joinRoom({ userInfo, roomPassword }, (error) => {
        if (error) {
          this.setState({ page: 1 });
          console.log(error);
          return;
        }
        this.onRoomJoined({ userInfo, roomPassword });
      });
    }
  };

  getStorageInfo = () => {
    let userInfo = {};
    userInfo.userName = sessionStorage.getItem("userName");
    userInfo.userRole = sessionStorage.getItem("userRole");
    userInfo.userRoom = sessionStorage.getItem("userRoom");
    let roomPassword = sessionStorage.getItem("roomPassword");
    return { userInfo, roomPassword };
  };

  setStorageInfo = ({ userInfo, roomPassword }) => {
    sessionStorage.setItem("userName", userInfo.userName);
    sessionStorage.setItem("userRole", userInfo.userRole);
    sessionStorage.setItem("userRoom", userInfo.userRoom);
    sessionStorage.setItem("roomPassword", roomPassword);
  };

  clearStorageInfo = () => {
    sessionStorage.clear();
  };

  onRoomJoined = ({ userInfo, roomPassword }) => {
    this.setState({ page: 2 });
    this.setStorageInfo({ userInfo, roomPassword });
    this.props.setUserInfoDispatcher({ ...userInfo, roomPassword });
    this.onListenEvents({ userInfo, roomPassword });
  };

  onListenEvents = ({ userInfo, roomPassword }) => {
    socketClient.listeningOn(NEW_MESSAGE, (data) => {
      this.props.newMessageDispatcher(data);
      this.props.newMessageNotifyDispatcher();
    });

    socketClient.listeningOn(REMOVE_ALL_MESSAGES, (data) => {
      this.props.removeAllMessageDispatcher();
    });

    socketClient.listeningOn(NEW_PROBLEM, (data) => {
      this.props.newProblemDispatcher(data);
      this.props.newProblemNotifyDispatcher();
    });
    socketClient.listeningOn(NEW_SOLUTION, (data) => {
      this.props.newSolutionDispatcher(data);
      this.props.newSolutionNotifyDispatcher();
    });

    socketClient.listeningOn(REMOVE_ALL_SOLUTION, (data) => {
      this.props.removeAllSolutionDispatcher();
    });
    socketClient.listeningOn(
      CHANGE_ROOM_INFO,
      this.props.newRoomInfoDispatcher
    );

    socketClient.listeningOn(KICK_OUT, this.logOutRoom);

    socketClient.fetchFromRoom(
      ALL_MESSAGE,
      userInfo.userRoom,
      this.props.allMessageDispatcher
    );
    socketClient.fetchFromRoom(
      ALL_PROBLEM,
      userInfo.userRoom,
      this.props.allProblemDispatcher
    );
    socketClient.fetchFromRoom(
      ALL_SOLUTION,
      userInfo.userRoom,
      this.props.allSolutionDispatcher
    );
    socketClient.fetchFromRoom(
      ROOM_INFO,
      userInfo.userRoom,
      this.props.getRoomInfoDispatcher
    );
  };

  logOutRoom = () => {
    this.clearStorageInfo();
    window.location.reload();
  };
  render() {
    const { page, userInfo } = this.state;
    return (
      <div>
        {page == 1 ? (
          <LoginPage onRoomJoined={this.onRoomJoined} />
        ) : (
          <ChatPage userInfo={userInfo} logOutRoom={this.logOutRoom} />
        )}
      </div>
    );
  }
}
const mapStateToDispatch = (dispatch) => ({
  allMessageDispatcher: (data) => dispatch(allMessageAction(data)),
  newMessageDispatcher: (data) => dispatch(newMessageAction(data)),
  newMessageNotifyDispatcher: () => dispatch(messageArriveNotifyAction()),
  removeAllMessageDispatcher: () => dispatch(removeAllMessageAction()),

  allProblemDispatcher: (data) => dispatch(allProblemAction(data)),
  newProblemDispatcher: (data) => dispatch(newProblemAction(data)),
  newProblemNotifyDispatcher: () => dispatch(problemArriveNotifyAction()),

  newSolutionDispatcher: (data) => dispatch(newSolutionAction(data)),
  newSolutionNotifyDispatcher: () => dispatch(solutionArriveNotifyAction()),
  allSolutionDispatcher: (data) => dispatch(allSolutionAction(data)),
  removeAllSolutionDispatcher: () => dispatch(removeAllSolutionAction()),

  getRoomInfoDispatcher: (data) => dispatch(getRoomInfoAction(data)),
  newRoomInfoDispatcher: (data) => dispatch(newRoomInfoAction(data)),
  setUserInfoDispatcher: (data) => dispatch({ type: USER_INFO, payload: data }),
});

export default connect(null, mapStateToDispatch)(App);

import React from "react";

import ChatPage from "./components/pages/chat/ChatPage";
import LoginPage from "./components/pages/steps/LoginPage";
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
} from "./sockets/EventType";
import {
  messageArriveNotifyAction,
  problemArriveNotifyAction,
  solutionArriveNotifyAction,
} from "./redux/actions/NotifyActions";

class App extends React.Component {
  state = {
    page: 1,
  };

  componentDidMount = () => {
    let userInfo = this.getStorageInfo();
    if (!!userInfo.userName && !!userInfo.userRole && !!userInfo.userRoom) {
      socketClient.joinRoom(userInfo, (rooms) => this.onRoomJoined(userInfo));
    }
  };

  getStorageInfo = () => {
    let userInfo = {};
    userInfo.userName = sessionStorage.getItem("userName");
    userInfo.userRole = sessionStorage.getItem("userRole");
    userInfo.userRoom = sessionStorage.getItem("userRoom");
    return userInfo;
  };

  setStorageInfo = (userInfo) => {
    sessionStorage.setItem("userName", userInfo.userName);
    sessionStorage.setItem("userRole", userInfo.userRole);
    sessionStorage.setItem("userRoom", userInfo.userRoom);
  };

  clearStorageInfo = () => {
    sessionStorage.clear();
  };

  onRoomJoined = (userInfo) => {
    this.setStorageInfo(userInfo);
    this.setState({ page: 2 });
    this.onListenEvents(userInfo);
  };

  onListenEvents = (userInfo) => {
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
  };

  logOutRoom = () => {
    console.log("logged out");

    this.clearStorageInfo();
    this.setState({ page: 1 });
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
});

export default connect(null, mapStateToDispatch)(App);

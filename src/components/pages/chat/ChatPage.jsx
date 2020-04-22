import React, { Component } from "react";
import Sidebar_ from "../../common/sidebar/Sidebar_";
import ActiveUsers from "../../common/users/ActiveUsers";
import InterviewBox from "../../common/interviewbox/InterviewBox";

// css
import Styles from "./ChatPage.module.css";
import socketClient from "../../../sockets/SocketClient";
import { REMOVE_ALL_MESSAGES } from "../../../sockets/EventType";

import { connect } from "react-redux";
import { removeAllMessageAction } from "../../../redux/actions/ChatActions";

class ChatPage extends Component {
  state = {
    userWindow: false,
  };

  onExpand = () => this.setState({ userWindow: !this.state.userWindow });
  removeAllMessage = () => {
    socketClient.fetchFromRoom(
      REMOVE_ALL_MESSAGES,
      sessionStorage.getItem("userRoom"),
      (err) => {
        if (err) console.log("error : ", err);
        this.props.removeAllMessageAction();
      }
    );
  };
  logOutRoom = () =>
    socketClient.leaveRoom(
      sessionStorage.getItem("userRoom"),
      this.props.logOutRoom
    );

  render() {
    const { userWindow } = this.state;
    return (
      <div className={Styles.parentBox}>
        <Sidebar_
          owner={this.props.room.owner}
          onExpand={this.onExpand}
          userWindow={userWindow}
          logOutRoom={this.logOutRoom}
          removeAllMessage={this.removeAllMessage}
        >
          <ActiveUsers />
        </Sidebar_>
        <InterviewBox />
      </div>
    );
  }
}

const mapStateToProps = (state) => ({
  room: state.Room,
});
export default connect(mapStateToProps, {
  removeAllMessageAction,
})(ChatPage);

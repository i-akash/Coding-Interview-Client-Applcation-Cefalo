import React, { Component } from "react";
import { Segment, Header } from "semantic-ui-react";
import socketClient from "../../../sockets/SocketClient";
import {
  ALL_CLIENT_IN_ROOM,
  NEW_JOINING_ROOM,
  LEFT_ROOM,
  KICK_OUT,
} from "../../../sockets/EventType";

import { connect } from "react-redux";

class ActiveUsers extends Component {
  state = {
    activeUsers: [],
  };

  kickOut = (kickedUser) => {
    const { room, user } = this.props;
    if (room.owner === user.userName && user.userName !== kickedUser.userName) {
      socketClient.pushToRoom(
        KICK_OUT,
        kickedUser.userRoom,
        { socketId: kickedUser.userId },
        (error) => console.log(error)
      );
    } else {
      console.log("You are not allowed");
    }
  };

  componentDidMount = () => {
    socketClient.fetchFromRoom(
      ALL_CLIENT_IN_ROOM,
      sessionStorage.getItem("userRoom"),
      (clients) => this.setState({ activeUsers: clients })
    );
    socketClient.listeningOn(NEW_JOINING_ROOM, (activeUser) =>
      this.setState({ activeUsers: this.state.activeUsers.concat(activeUser) })
    );
    socketClient.listeningOn(LEFT_ROOM, (userId) =>
      this.setState({
        activeUsers: this.state.activeUsers.filter(
          (user) => user.userId !== userId
        ),
      })
    );
  };

  render() {
    const { activeUsers } = this.state;
    return (
      <Segment.Group size="mini">
        {activeUsers.map((user, index) => (
          <Segment
            textAlign="left"
            basic
            size="small"
            style={{
              marginTop: "8px",
              paddingTop: "0px",
              paddingBottom: "0px",
              borderRadius: 0,
              borderLeft: "2px solid #00CB54",
              color: "white",
              cursor: "pointer",
            }}
            onClick={() => this.kickOut(user)}
          >
            <Header color="grey" size="small">
              {user.userName}
            </Header>
            {user.userRole}
          </Segment>
        ))}
      </Segment.Group>
    );
  }
}

const mapStateToProps = (state) => ({
  room: state.Room,
  user: state.User,
});
export default connect(mapStateToProps)(ActiveUsers);

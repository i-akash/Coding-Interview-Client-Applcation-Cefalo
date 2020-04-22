import React, { Component } from "react";
import UserInfo from "../../forms/UserInfo";
import socketClient from "../../../sockets/SocketClient";

//css
import Styles from "./LoginPage.module.css";
import { ALL_ROOM } from "../../../sockets/EventType";
import { Header } from "semantic-ui-react";

const roleOptions = [
  {
    key: 0,
    text: "Interviewer",
    value: 0,
  },
  {
    key: 1,
    text: "Candidate",
    value: 1,
  },
];

export default class LoginPage extends Component {
  state = {
    roomOptions: [
      {
        key: 0,
        text: "Session 1",
        value: 0,
      },
    ],
    joinError: "",
  };

  preprocess = (allRooms = []) => {
    let roomOptions = [];
    allRooms.map((room, index) =>
      roomOptions.push({
        key: index,
        text: room.name,
        value: index,
        description: room.private ? "private" : "public ",
      })
    );
    this.setState({ roomOptions });
  };

  componentDidMount = () => {
    socketClient.fetchFromNamespace(ALL_ROOM, this.preprocess);
  };

  onChooseRoomFocus = () => {
    socketClient.fetchFromNamespace(ALL_ROOM, this.preprocess);
  };

  onEnter = (joinInfo) => {
    this.setState({ joinError: "" });
    socketClient.joinRoom(joinInfo, (error) => {
      if (error) {
        this.setState({ joinError: error });
        return;
      }
      this.props.onRoomJoined(joinInfo);
    });
  };

  render() {
    const { roomOptions, joinError } = this.state;
    return (
      <div className={Styles.loginPage}>
        <div>
          <Header
            as="h1"
            color="green"
            textAlign="center"
            content="Coding Interview"
          />
          <Header
            as="h4"
            color="grey"
            textAlign="center"
            content="Hire or Get Hired"
            style={{ margin: 0 }}
          />
        </div>
        <UserInfo
          joinError={joinError}
          onEnter={this.onEnter}
          roomOptions={roomOptions}
          roleOptions={roleOptions}
          onChooseRoomFocus={this.onChooseRoomFocus}
        />
      </div>
    );
  }
}

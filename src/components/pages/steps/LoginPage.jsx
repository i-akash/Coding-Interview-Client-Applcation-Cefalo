import React, { Component } from "react";
import UserInfo from "../../forms/UserInfo";
import socketClient from "../../../sockets/SocketClient";

//css
import Styles from "./LoginPage.module.css";
import { ALL_ROOM } from "../../../sockets/EventType";

const roleOptions = [
  {
    key: 1,
    text: "Interviewer",
    value: "Interviewer",
  },
  {
    key: 2,
    text: "Candidate",
    value: "Candidate",
  },
];

export default class LoginPage extends Component {
  state = {
    roomOptions: [
      {
        key: 1,
        text: "Session 1",
        value: "Session 1",
      },
    ],
  };

  preprocess = (allRooms = []) => {
    let roomOptions = [];
    allRooms.map((room, index) =>
      roomOptions.push({ key: index, text: room, value: room })
    );
    this.setState({ roomOptions });
  };

  componentDidMount = () => {
    socketClient.fetchFromNamespace(ALL_ROOM, "/", this.preprocess);
  };

  onChooseRoomFocus = () => {
    socketClient.fetchFromNamespace(ALL_ROOM, "/", this.preprocess);
  };

  onEnter = (userInfo) => {
    socketClient.joinRoom(userInfo, (error) => {
      if (error) {
        console.log(error);
        return;
      }
      this.props.onRoomJoined(userInfo);
    });
  };

  render() {
    const { roomOptions } = this.state;
    return (
      <div className={Styles.loginPage}>
        <UserInfo
          onEnter={this.onEnter}
          roomOptions={roomOptions}
          roleOptions={roleOptions}
          onChooseRoomFocus={this.onChooseRoomFocus}
        />
      </div>
    );
  }
}

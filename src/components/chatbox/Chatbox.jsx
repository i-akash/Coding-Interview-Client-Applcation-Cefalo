import React, { Component } from "react";
import Styles from "./Chatbox.module.css";
import MessageBox from "./MessageBox";
import ChatTextArea from "./ChatTextArea";

import socketClient from "../../sockets/SocketClient";
import { NEW_MESSAGE, MESSAGE_TYPING } from "../../sockets/EventType";
import { connect } from "react-redux";
import { seenMessageNotifyAction } from "../../redux/actions/NotifyActions";

class Chatbox extends Component {
  state = {
    selectedCodeObject: {
      code: "",
      userName: "",
      timeStamp: new Date(),
      language: "javascript",
    },
    typingUser: "",
  };

  componentDidMount = () => {
    socketClient.listeningOn(MESSAGE_TYPING, (user) => {
      clearTimeout(this.typerTimeout);
      this.typerTimeout = setTimeout(
        () => this.setState({ typingUser: "" }),
        2000
      );
      this.setState({ typingUser: user });
    });

    this.props.seenMessageNotifyAction();
  };

  componentWillUnmount = () => {
    socketClient.socket.removeListener(MESSAGE_TYPING);
    clearTimeout(this.typerTimeout);
    this.props.seenMessageNotifyAction();
  };

  componentWillReceiveProps(nextProps) {
    let { selectedCodeObject } = nextProps;
    let parser = (({ userName, timeStamp, language }) => ({
      userName,
      timeStamp,
      language,
    }))(selectedCodeObject);
    let parsedSelectedCodeObject = {
      code: selectedCodeObject.selectedLines.join("\n"),
      ...parser,
    };
    this.setState({ selectedCodeObject: parsedSelectedCodeObject });
  }

  onTyping = () => {
    socketClient.socket.emit(
      MESSAGE_TYPING,
      sessionStorage.getItem("userRoom"),
      sessionStorage.getItem("userName")
    );
  };

  onMessageSend = (text) => {
    const { selectedCodeObject } = this.state;

    let craftedMessage = {
      userName: sessionStorage.getItem("userName"),
      solution: selectedCodeObject,
      text,
    };

    socketClient.pushToRoom(
      NEW_MESSAGE,
      sessionStorage.getItem("userRoom"),
      craftedMessage,
      () => console.log("delevered")
    );

    this.setState({ text: "" });
    this.clearCodeSelection();
  };

  clearCodeSelection = () => {
    this.setState({ selectedCodeObject: {} });
    this.props.clearSelectedLines();

    if (!!this.props.clearCodeSelctionFormat)
      this.props.clearCodeSelctionFormat();
  };

  render() {
    const { selectedCodeObject, typingUser } = this.state;
    return (
      <div className={Styles.chatBox}>
        <MessageBox
          typingUser={typingUser}
          updateCodeSelection={this.props.updateCodeSelection}
        />
        <ChatTextArea
          clearCodeSelection={this.clearCodeSelection}
          selectedCodeObject={selectedCodeObject}
          onMessageSend={this.onMessageSend}
          onTyping={this.onTyping}
        />
      </div>
    );
  }
}

export default connect(null, { seenMessageNotifyAction })(Chatbox);

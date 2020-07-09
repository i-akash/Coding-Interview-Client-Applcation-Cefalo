import React, { Component } from "react";
import SelectOrCreate from "../../shared_components/dropdown/SelectOrCreate";
import {
  Form,
  Header,
  Transition,
  Message,
  Button,
  Checkbox,
} from "semantic-ui-react";

import socketClient from "../../sockets/SocketClient";

//css
import "./Form.css";
import { ALL_CLIENT_IN_ROOM } from "../../sockets/EventType";

export default class UserInfo extends Component {
  state = {
    userName: "",
    userRole: "",
    userRoom: "",
    roomPassword: "",
    privateRoom: false,
    roomPermissionNeeded: false,

    formError: {},
  };

  onChange = (event) =>
    this.setState({ [event.target.name]: event.target.value });
  onSelectRoom = ({ text, description }) => {
    this.setState({
      userRoom: text,
      privateRoom: description === "private",
      roomPermissionNeeded: !!!description,
    });
  };

  onSubmit = (event) => {
    event.preventDefault();
    const { userName, userRole, userRoom, roomPassword } = this.state;
    this.isUserNameTaken({ userName, userRoom }, (isTaken) => {
      if (isTaken)
        this.setState({
          formError: { userName: `${userName} is already taken (-_-)` },
        });
      else {
        this.setState({ formError: {} });
        this.props.onEnter({
          userInfo: { userName, userRole, userRoom },
          roomPassword,
        });
      }
    });
  };

  isUserNameTaken = ({ userName, userRoom }, callback) => {
    socketClient.fetchFromRoom(ALL_CLIENT_IN_ROOM, userRoom, (clients = []) => {
      let isTaken = false;
      clients.every((client) => {
        if (client.userName.toLowerCase() === userName.toLowerCase()) {
          isTaken = true;
          return false;
        }
        return true;
      });

      callback(isTaken);
    });
  };

  render() {
    const {
      userName,
      loading,
      formError,
      privateRoom,
      roomPassword,
      roomPermissionNeeded,
    } = this.state;
    const { roomOptions, roleOptions, joinError } = this.props;

    return (
      <div className="form-container">
        <Form size="small" loading={loading} onSubmit={this.onSubmit}>
          <Header
            color="green"
            textAlign="center"
            content="Entrance"
            style={{ marginBottom: "4rem" }}
          />
          <Transition visible={!!joinError} animation="fade" duration={800}>
            <Message negative content={joinError} />
          </Transition>
          <Form.Field>
            <Form.Input
              icon="user"
              iconPosition="left"
              required
              name="userName"
              value={userName}
              onChange={this.onChange}
              placeholder="userName"
              error={
                !!formError.userName && {
                  content: formError.userName,
                  pointing: "below",
                }
              }
            />
          </Form.Field>

          <Form.Field>
            <SelectOrCreate
              placeholder="Choose Role"
              allowAdditions={false}
              options={roleOptions}
              onSelect={({ text }) => this.setState({ userRole: text })}
            />
          </Form.Field>
          <Form.Field>
            <SelectOrCreate
              placeholder="Choose Room"
              options={roomOptions}
              onSelect={this.onSelectRoom}
              onFocus={this.props.onChooseRoomFocus}
            />
          </Form.Field>
          {roomPermissionNeeded && (
            <React.Fragment>
              <Checkbox
                label={"Private"}
                onChange={() => this.setState({ privateRoom: !privateRoom })}
                checked={privateRoom}
              />{" "}
              <br />
            </React.Fragment>
          )}
          {privateRoom && (
            <Form.Field>
              <Form.Input
                icon="key"
                iconPosition="left"
                type="password"
                required
                name="roomPassword"
                value={roomPassword}
                onChange={this.onChange}
                placeholder="Room Password"
              />
            </Form.Field>
          )}
          <Button icon="sign in" content="Join" size="mini" color="green" />
        </Form>
      </div>
    );
  }
}

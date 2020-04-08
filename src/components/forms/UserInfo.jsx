import React, { Component } from "react";
import SelectOrCreate from "../common/dropdown/SelectOrCreate";
import { Form, Header, Transition, Message, Button } from "semantic-ui-react";

import socketClient from "../../sockets/SocketClient";

//css
import "./Form.css";
import { ALL_CLIENT_IN_ROOM } from "../../sockets/EventType";

export default class UserInfo extends Component {
  state = {
    userName: "",
    userRole: "",
    userRoom: "",
    formError: {},
  };

  onChange = (event) =>
    this.setState({ [event.target.name]: event.target.value });

  onSelectRoom = (value) => {
    this.setState({ userRoom: value });
  };

  onSubmit = (event) => {
    event.preventDefault();
    const { userName, userRole, userRoom } = this.state;
    this.isUserNameTaken({ userName, userRoom }, (status) => {
      if (status)
        this.setState({
          formError: { userName: [`${userName} is already taken (-_-)`] },
        });
      else this.props.onEnter({ userName, userRole, userRoom });
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
    const { userName, userRole, loading, status, formError } = this.state;
    const { roomOptions, roleOptions } = this.props;

    return (
      <div className="form-container">
        <Form size="small" loading={loading} onSubmit={this.onSubmit}>
          <Header color="green" textAlign="center" content="Entrance" />
          <Transition visible={!!status} animation="fade" duration={800}>
            <Message negative list={status} />
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
                  content: formError.userName[0],
                  pointing: "below",
                }
              }
            />
          </Form.Field>
          <Form.Field>
            <SelectOrCreate
              placeholder="Choose Role"
              options={roleOptions}
              onSelect={(value) => this.setState({ userRole: value })}
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
          <Button size="mini" color="green">
            Enter
          </Button>
        </Form>
      </div>
    );
  }
}

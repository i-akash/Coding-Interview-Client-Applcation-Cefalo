import React, { Component } from "react";
import {
  Segment,
  Label,
  Button,
  Icon,
  GridRow,
  GridColumn,
  Grid,
  Header,
} from "semantic-ui-react";
import { connect } from "react-redux";
import SelectOrCreate from "../../shared_components/dropdown/SelectOrCreate";
import socketClient from "../../sockets/SocketClient";
import { ALL_CLIENT_IN_ROOM, CHANGE_ROOM_INFO } from "../../sockets/EventType";

class UserProfile extends Component {
  state = {
    willChangeOwner: false,
    userOptions: [],
  };

  toggleOwnerChange = () =>
    this.setState({ willChangeOwner: !this.state.willChangeOwner });

  onSelectOwner = ({ text }) => {
    let { room } = this.props;
    room.owner = text;
    console.log(text, room);

    socketClient.pushToRoom(CHANGE_ROOM_INFO, room.name, room, (error) => {
      if (error) {
        console.log(error);
        return;
      }
      this.setState({ willChangeOwner: false });
    });
  };
  preprocess = (users = []) => {
    let userOptions = users
      .filter((user) => user.userRole === "Interviewer")
      .map((user, index) => ({
        key: index,
        text: user.userName,
        value: index,
        description: user.userRole,
      }));
    this.setState({ userOptions });
  };
  fetchUsers = () =>
    socketClient.fetchFromRoom(
      ALL_CLIENT_IN_ROOM,
      sessionStorage.getItem("userRoom"),
      this.preprocess
    );

  render() {
    const { willChangeOwner, userOptions } = this.state;
    return (
      // <Segment basic >
      <Grid style={{ margin: "1rem", backgroundColor: "whitesmoke" }}>
        <Grid.Row columns={1}>
          <Grid.Column>
            <Header textAlign="center" content="User Info" />
          </Grid.Column>
        </Grid.Row>
        <Grid.Row columns={2}>
          <Grid.Column width={5} style={{ fontWeight: "bold" }}>
            Name :
          </Grid.Column>
          <Grid.Column>{sessionStorage.getItem("userName")} </Grid.Column>
        </Grid.Row>
        <Grid.Row columns={2}>
          <Grid.Column width={5} style={{ fontWeight: "bold" }}>
            Role :
          </Grid.Column>
          <Grid.Column>{sessionStorage.getItem("userRole")} </Grid.Column>
        </Grid.Row>
        <Grid.Row columns={1}>
          <Grid.Column>
            <Header textAlign="center" content="Room Info" />
          </Grid.Column>
        </Grid.Row>
        <Grid.Row columns={2}>
          <Grid.Column width={5} style={{ fontWeight: "bold" }}>
            Room :
          </Grid.Column>
          <Grid.Column> {sessionStorage.getItem("userRoom")} </Grid.Column>
        </Grid.Row>
        <Grid.Row columns={2}>
          <Grid.Column width={5} style={{ fontWeight: "bold" }}>
            Room Type :
          </Grid.Column>
          <Grid.Column>
            {!!this.props.room.password ? "Private" : "Public"}{" "}
          </Grid.Column>
        </Grid.Row>
        {!!this.props.room.password && (
          <Grid.Row columns={2}>
            <Grid.Column width={5} style={{ fontWeight: "bold" }}>
              Room Pass :
            </Grid.Column>
            <Grid.Column> {this.props.room.password} </Grid.Column>
          </Grid.Row>
        )}
        <Grid.Row columns={3} stretched verticalAlign="middle">
          <Grid.Column width={5} style={{ fontWeight: "bold" }}>
            Room Owner :
          </Grid.Column>
          <Grid.Column> {this.props.room.owner} </Grid.Column>
          {this.props.room.owner === sessionStorage.getItem("userName") && (
            <Grid.Column floated="right">
              <Button
                color="green"
                size="mini"
                content={willChangeOwner ? "Cancel" : "Transfer"}
                onClick={this.toggleOwnerChange}
              />
            </Grid.Column>
          )}
        </Grid.Row>
        <Grid.Row columns={1} stretched>
          <Grid.Column>
            {willChangeOwner && (
              <SelectOrCreate
                placeholder="Choose Owner"
                allowAdditions={false}
                options={userOptions}
                onSelect={this.onSelectOwner}
                onFocus={this.fetchUsers}
              />
            )}
          </Grid.Column>
        </Grid.Row>
      </Grid>
      // </Segment>
    );
  }
}
const mapStateToProps = (state) => ({
  room: state.Room,
});
export default connect(mapStateToProps)(UserProfile);

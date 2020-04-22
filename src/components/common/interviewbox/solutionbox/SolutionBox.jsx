import React, { Component } from "react";
import Editorbox from "./Editorbox";
import SolutionsList from "./SolutionsList";
import { Button } from "semantic-ui-react";

import { connect } from "react-redux";
import { REMOVE_ALL_SOLUTION } from "../../../../sockets/EventType";
import { removeAllSolutionAction } from "../../../../redux/actions/SolutionActions";
import socketClient from "../../../../sockets/SocketClient";
import { seenSolutionNotifyAction } from "../../../../redux/actions/NotifyActions";

class SolutionBox extends Component {
  state = {
    editorToggler: false,
  };

  componentDidMount = () => {
    this.props.seenSolutionNotifyAction();
  };

  toggleEditor = () =>
    this.setState({ editorToggler: !this.state.editorToggler });

  removeAllSolutions = () => {
    socketClient.fetchFromRoom(
      REMOVE_ALL_SOLUTION,
      sessionStorage.getItem("userRoom"),
      (err) => {
        if (err) console.log("error : ", err);
        this.props.removeAllSolutionAction();
      }
    );
  };
  render() {
    const { editorToggler } = this.state;
    return (
      <div>
        {!!this.props.problem.inputConstraint && editorToggler && (
          <Button
            icon="arrow left"
            circular
            size="mini"
            onClick={this.toggleEditor}
          />
        )}
        {!!this.props.problem.inputConstraint && !editorToggler && (
          <Button
            icon="lightbulb"
            content="solve"
            color="green"
            circular
            size="mini"
            onClick={this.toggleEditor}
          />
        )}

        {sessionStorage.getItem("userName") === this.props.room.owner &&
          !editorToggler && (
            <Button
              icon="close"
              content="all"
              circular
              color="red"
              size="mini"
              onClick={this.removeAllSolutions}
            />
          )}
        {editorToggler ? (
          <Editorbox />
        ) : (
          <SolutionsList updateCodeSelection={this.props.updateCodeSelection} />
        )}
      </div>
    );
  }
}
const mapStateToProps = (state) => ({
  problem: state.Problems,
  room: state.Room,
});
export default connect(mapStateToProps, {
  removeAllSolutionAction,
  seenSolutionNotifyAction,
})(SolutionBox);

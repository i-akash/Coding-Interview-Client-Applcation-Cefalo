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
        {!!this.props.problem.inputConstraint && (
          <Button size="mini" color="green" onClick={this.toggleEditor}>
            {editorToggler ? "Back" : "Solve"}
          </Button>
        )}
        {sessionStorage.getItem("userRole") === "Interviewer" &&
          !editorToggler && (
            <Button
              size="mini"
              color="red"
              content="remove all"
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
});
export default connect(mapStateToProps, {
  removeAllSolutionAction,
  seenSolutionNotifyAction,
})(SolutionBox);

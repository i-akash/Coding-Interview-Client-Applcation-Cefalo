import React, { Component } from "react";
import { Button, Icon } from "semantic-ui-react";

import { connect } from "react-redux";
import ProblemForm from "./ProblemForm";
import Problem from "./Problem";
import FloatingPage from "../../shared_components/floating/FloatingPage";
import { seenProblemNotifyAction } from "../../redux/actions/NotifyActions";
import socketClient from "../../sockets/SocketClient";
import { REMOVE_PROBLEM } from "../../sockets/EventType";

class Problemsbox extends Component {
  state = {
    editorToggler: false,
    problem: {},

    submitMessage: null,
  };

  componentDidMount = () => {
    const { problems } = this.props;
    this.setState({ problem: problems });
    this.props.seenProblemNotifyAction();
  };

  componentWillReceiveProps = (nextProps) => {
    const { problems } = nextProps;
    this.setState({ problem: problems });
  };

  toggleEditor = () =>
    this.setState({ editorToggler: !this.state.editorToggler });

  eraseProblem = () =>
    socketClient.pushToRoom(
      REMOVE_PROBLEM,
      this.props.room.name,
      "",
      (error) => {
        console.log(error);
      }
    );
  getControllbtn = () => {
    const myUserName = sessionStorage.getItem("userName");
    const { editorToggler, problem } = this.state;
    const { problemStatement, userName } = problem;

    if (editorToggler)
      return (
        <Button
          icon="arrow left"
          circular
          size="mini"
          onClick={this.toggleEditor}
        />
      );

    if (!!problemStatement === false && myUserName === this.props.room.owner)
      return (
        <Button
          color="green"
          size="mini"
          icon="plus"
          circular
          onClick={this.toggleEditor}
        />
      );

    if (myUserName === this.props.room.owner)
      return (
        <React.Fragment>
          <Button
            color="green"
            size="mini"
            icon="edit"
            circular
            onClick={this.toggleEditor}
          />
          <Button
            icon="close"
            circular
            color="red"
            size="mini"
            onClick={this.eraseProblem}
          />
        </React.Fragment>
      );
  };

  onSubmitted = (error) => {
    console.log(error);
    this.setState({
      editorToggler: false,
      submitMessage: "Submitted Successfully",
    });
  };

  render() {
    const { editorToggler, problem, submitMessage } = this.state;

    return (
      <div>
        {this.getControllbtn()}
        <FloatingPage
          open={!!submitMessage}
          header="Edit Problem"
          clickText="ok"
          onClick={() => this.setState({ submitMessage: null })}
          toggle={() => this.setState({ submitMessage: null })}
        >
          {submitMessage}
        </FloatingPage>
        {!editorToggler ? (
          <Problem problem={problem} />
        ) : (
          <ProblemForm problem={problem} onSubmitted={this.onSubmitted} />
        )}
      </div>
    );
  }
}

const mapStateToProps = (state) => ({
  problems: state.Problems,
  room: state.Room,
});

export default connect(mapStateToProps, { seenProblemNotifyAction })(
  Problemsbox
);

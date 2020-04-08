import React, { Component } from "react";
import { Button } from "semantic-ui-react";

import { connect } from "react-redux";
import ProblemForm from "./ProblemForm";
import Problem from "./Problem";
import FloatingPage from "../../floating/FloatingPage";
import { seenProblemNotifyAction } from "../../../../redux/actions/NotifyActions";

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

  getControllbtn = () => {
    const myUserName = sessionStorage.getItem("userName");
    const myUserRole = sessionStorage.getItem("userRole");
    const { editorToggler, problem } = this.state;
    const { problemStatement, userName } = problem;

    if (editorToggler)
      return (
        <Button color="green" size="mini" onClick={this.toggleEditor}>
          Back
        </Button>
      );

    if (!!problemStatement === false && myUserRole === "Interviewer")
      return (
        <Button color="green" size="mini" onClick={this.toggleEditor}>
          Add
        </Button>
      );

    if (userName === myUserName && myUserRole === "Interviewer")
      return (
        <Button color="green" size="mini" onClick={this.toggleEditor}>
          Edit
        </Button>
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
});

export default connect(mapStateToProps, { seenProblemNotifyAction })(
  Problemsbox
);

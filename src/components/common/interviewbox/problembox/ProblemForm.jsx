import React, { Component } from "react";
import Styles from "./Problembox.module.css";
import TextEditor from "../../editor/TextEditor";
import { Button, Header, Input, Label, Segment } from "semantic-ui-react";
import socketClient from "../../../../sockets/SocketClient";

import { NEW_PROBLEM } from "../../../../sockets/EventType";
import ResizableTextarea from "../../textarea/ResizableTextArea";
import CodeEditor from "../../editor/CodeEditor";
import { cleanSpaceNnewLine } from "../../../../utils/CleanUp";
import FloatingPage from "../../floating/FloatingPage";
import CollapseList from "../../listing/CollapseList";

class ProblemForm extends Component {
  state = {
    userName: "",
    title: "",
    problemStatement: "",
    testCases: [],
    inputConstraint: {},
    timeStamp: new Date(),

    constraint: "",

    input: "",
    output: "",

    modalOpen: false,
    loading: false,
  };
  componentDidMount = () => {
    const { problem } = this.props;
    this.setState({
      ...problem,
      constraint: JSON.stringify(problem.inputConstraint || {}),
    });
  };

  componentWillReceiveProps = (nextProps) => {
    const { problem } = nextProps;
    this.setState({
      ...problem,
      constraint: JSON.stringify(problem.inputConstraint || {}),
    });
  };

  onSubmit = () => {
    let { title, problemStatement, constraint, testCases } = this.state;

    let room = sessionStorage.getItem("userRoom");
    let userName = sessionStorage.getItem("userName");

    constraint = constraint.replace(/\n+/g, " ");

    let inputConstraint = JSON.parse(constraint);
    this.setState({ loading: true });

    socketClient.pushToRoom(
      NEW_PROBLEM,
      room,
      { userName, title, problemStatement, testCases, inputConstraint },
      this.props.onSubmitted
    );
  };

  onPushTestCases = () => {
    let { input, output, testCases } = this.state;
    input = cleanSpaceNnewLine(input);
    output = cleanSpaceNnewLine(output);
    console.log(input, output);

    this.setState({ testCases: testCases.concat({ input, output }) });
  };

  onPopTestCases = () => {
    let temp = [...this.state.testCases];
    temp.pop();
    this.setState({ testCases: temp });
  };

  onChange = (event) =>
    this.setState({ [event.target.name]: event.target.value });

  updateContent = (problemStatement) => this.setState({ problemStatement });

  updateConstraint = (json) => this.setState({ constraint: json });

  toggleModal = () => this.setState({ modalOpen: !this.state.modalOpen });
  render() {
    const {
      loading,
      problemStatement,
      constraint,
      title,
      input,
      output,
      testCases,
      modalOpen,
    } = this.state;

    return (
      <div className={Styles.problemBox}>
        <FloatingPage
          onClick={this.toggleModal}
          clickText="Ok"
          open={modalOpen}
          toggle={this.toggleModal}
        >
          <CollapseList lists={testCases} title="test case" run={false} />
          <Segment style={{ margin: "0" }}>
            <div>
              <ResizableTextarea
                rows={2}
                minRows={2}
                maxRows={4}
                placeholder={"test input"}
                value={input}
                name="input"
                onChange={this.onChange}
              />
              <ResizableTextarea
                rows={2}
                minRows={2}
                maxRows={4}
                placeholder={"test output"}
                value={output}
                name="output"
                onChange={this.onChange}
              />
            </div>
            <Button color="green" size="mini" onClick={this.onPushTestCases}>
              Add
            </Button>
            <Button color="red" size="mini" onClick={this.onPopTestCases}>
              Pop
            </Button>
          </Segment>
        </FloatingPage>

        <Segment basic loading={loading} style={{ margin: "0", padding: "0" }}>
          <Header textAlign="center">Create Problem</Header>
          <Segment>
            <Input
              name="title"
              fluid
              icon="tag"
              iconPosition="left"
              size="mini"
              onChange={this.onChange}
              value={title}
            />
            <TextEditor
              updateContent={this.updateContent}
              editorContent={this.props.problem.problemStatement}
            />
          </Segment>
          <Segment>
            <Button
              color="green"
              size="mini"
              onClick={() => this.setState({ modalOpen: !modalOpen })}
            >
              Add Tests Cases
            </Button>
          </Segment>
          <Segment
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
            }}
          >
            <div>
              <Label basic>Input Constraint</Label>
            </div>
            <CodeEditor
              height={"20vh"}
              styleClass={Styles.monacoEditor}
              onCodeChange={this.updateConstraint}
              value={constraint}
              language={"json"}
            />
          </Segment>
          <Button color="green" size="mini" onClick={this.onSubmit}>
            Submit
          </Button>
        </Segment>
      </div>
    );
  }
}

export default ProblemForm;

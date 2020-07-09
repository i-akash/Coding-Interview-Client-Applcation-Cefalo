import React, { Component } from "react";
import Styles from "./Problembox.module.css";
import TextEditor from "../../shared_components/text_editor/TextEditor";
import {
  Button,
  Header,
  Input,
  Label,
  Segment,
  Icon,
  Grid,
} from "semantic-ui-react";
import socketClient from "../../sockets/SocketClient";

import { NEW_PROBLEM } from "../../sockets/EventType";
import ResizableTextarea from "../../shared_components/textarea/ResizableTextArea";
import CodeEditor from "../../shared_components/code_editor/CodeEditor";
import { cleanSpaceNnewLine } from "../../utils/CleanUp";
import FloatingPage from "../../shared_components/floating/FloatingPage";
import CollapseList from "../../shared_components/listing/CollapseList";

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
      <div>
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
            <Button
              icon="plus"
              content="add"
              color="green"
              circular
              size="mini"
              onClick={this.onPushTestCases}
            />
            <Button
              color="red"
              circular
              icon="minus"
              content="pop"
              size="mini"
              onClick={this.onPopTestCases}
            />
          </Segment>
        </FloatingPage>

        <Grid>
          <Grid.Row>
            <Grid.Column>
              <Header textAlign="center" as="h3">
                Problem Editor
              </Header>
            </Grid.Column>
          </Grid.Row>
          <Grid.Row columns={1} stretched>
            <Grid.Column>
              <Input
                name="title"
                fluid
                icon="tag"
                iconPosition="left"
                size="small"
                onChange={this.onChange}
                value={title}
                placeholder="Title"
              />
            </Grid.Column>
          </Grid.Row>
          <Grid.Row columns={1}>
            <Grid.Column>
              <TextEditor
                updateContent={this.updateContent}
                editorContent={this.props.problem.problemStatement}
              />
            </Grid.Column>
          </Grid.Row>
          <Grid.Row columns={1}>
            <Grid.Column>
              <Button
                color="green"
                size="mini"
                icon="plus"
                content="Test Cases"
                onClick={() => this.setState({ modalOpen: !modalOpen })}
              />
            </Grid.Column>
          </Grid.Row>
          <Grid.Row columns={1}>
            <Grid.Column>
              <Header as="h4">Input Constraint</Header>

              <CodeEditor
                height={"20vh"}
                styleClass={Styles.monacoEditor}
                onCodeChange={this.updateConstraint}
                value={constraint}
                language={"json"}
              />
            </Grid.Column>
          </Grid.Row>
          <Grid.Row columns={1}>
            <Grid.Column>
              <Button
                icon="check"
                content="Submit"
                color="green"
                size="mini"
                onClick={this.onSubmit}
              />
            </Grid.Column>
          </Grid.Row>
        </Grid>
      </div>
    );
  }
}

export default ProblemForm;

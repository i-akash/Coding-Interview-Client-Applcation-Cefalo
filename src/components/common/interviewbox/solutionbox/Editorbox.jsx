import React, { Component } from "react";
import { Button, Transition, Checkbox, Segment, Icon } from "semantic-ui-react";
import CodeEditor from "../../editor/CodeEditor";
import Styles from "./Editorbox.module.css";

import socketClient from "../../../../sockets/SocketClient";
import ResizableTextarea from "../../textarea/ResizableTextArea";
import { NEW_SOLUTION } from "../../../../sockets/EventType";
import SelectOrCreate from "../../dropdown/SelectOrCreate";

import { connect } from "react-redux";
import { getJsTemplate, getPyTemplate } from "../../../../utils/CodeFornater";
import { cleanSpaceNnewLine } from "../../../../utils/CleanUp";
import FloatingPage from "../../floating/FloatingPage";
import CollapseList from "../../listing/CollapseList";
import { combineInputResult } from "../../../../utils/OutputParser";

class Editorbox extends Component {
  state = {
    sourceCode: getJsTemplate(this.props.problems.inputConstraint),
    language: "javascript",
    input: "",
    checked: false,

    submitStatus: false,
    runStatusList: null,
    loading: false,
  };

  onChange = (event) =>
    this.setState({ [event.target.name]: event.target.value });

  onCodeChange = (sourceCode) => {
    this.setState({ sourceCode });
  };
  selectLanguage = ({ text: language }) => {
    let { inputConstraint } = this.props.problems;
    switch (language) {
      case "javascript":
        this.setState({ language, sourceCode: getJsTemplate(inputConstraint) });
        break;
      default:
        this.setState({ language, sourceCode: getPyTemplate(inputConstraint) });
    }
  };

  onRun = () => {
    let { checked, input, sourceCode, language } = this.state;
    let { testCases, inputConstraint } = this.props.problems;

    if (checked) {
      input = cleanSpaceNnewLine(input);
      testCases = [{ input, output: "" }];
    }
    this.setState({ loading: true });
    socketClient.runSolution(
      { sourceCode, testCases, inputConstraint, language },
      (result) =>
        this.setState({
          loading: false,
          runStatusList: combineInputResult(testCases, result),
        })
    );
  };
  onSubmit = () => {
    let room = sessionStorage.getItem("userRoom");
    let userName = sessionStorage.getItem("userName");
    let { sourceCode, language } = this.state;
    socketClient.pushToRoom(
      NEW_SOLUTION,
      room,
      { userName, sourceCode, language },
      () => this.setState({ submitStatus: true })
    );
  };

  clearRunStatus = () => this.setState({ runStatusList: null });
  render() {
    const {
      loading,
      sourceCode,
      input,
      language,
      checked,
      runStatusList,
      submitStatus,
    } = this.state;
    return (
      <Segment basic style={{ padding: "0" }} loading={loading}>
        <FloatingPage
          open={!!runStatusList}
          header="Result"
          onClick={this.clearRunStatus}
          clickText="ok"
          toggle={this.clearRunStatus}
        >
          <CollapseList
            lists={runStatusList}
            title="test run result"
            run={!checked}
          />
        </FloatingPage>
        <FloatingPage
          open={submitStatus}
          header="Solution"
          clickText="ok"
          onClick={() => this.setState({ submitStatus: false })}
          toggle={() => this.setState({ submitStatus: false })}
        >
          Solution submitted
        </FloatingPage>

        <SelectOrCreate
          onSelect={this.selectLanguage}
          options={options}
          placeholder="language"
          allowAdditions={false}
        />
        <CodeEditor
          height={"50vh"}
          styleClass={Styles.monacoEditor}
          onCodeChange={this.onCodeChange}
          value={sourceCode}
          language={language}
        />

        <div>
          <Button
            icon="settings"
            content="Run"
            color="green"
            size="mini"
            onClick={this.onRun}
          />
          <Button
            icon="check"
            content="Submit"
            color="green"
            size="mini"
            onClick={this.onSubmit}
          />
        </div>
        <Checkbox
          label={"custom input"}
          onChange={() => this.setState({ checked: !checked })}
          checked={checked}
        />
        <Transition visible={checked}>
          <div>
            <ResizableTextarea
              rows={3}
              minRows={3}
              maxRows={4}
              placeholder={"Enter input.."}
              value={input}
              name="input"
              onChange={this.onChange}
            />
          </div>
        </Transition>
      </Segment>
    );
  }
}

const mapStateToProps = (state) => ({
  problems: state.Problems,
});

export default connect(mapStateToProps)(Editorbox);

const options = [
  {
    key: 0,
    text: "javascript",
    value: 0,
  },
  {
    key: 1,
    text: "python",
    value: 1,
  },
];

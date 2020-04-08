import React, { Component } from "react";
import CodeHighlightInteraction from "../../editor/CodeHighlightInteraction";
import { connect } from "react-redux";
import { Button, Accordion, Header, Label, Segment } from "semantic-ui-react";
import Author from "../../author/Author";
import socketClient from "../../../../sockets/SocketClient";
import { combineInputResult } from "../../../../utils/OutputParser";
import FloatingPage from "../../floating/FloatingPage";
import CollapseList from "../../listing/CollapseList";

class SolutionsList extends Component {
  state = {
    activeIndex: -1,
    runStatusList: null,
    loading: false,
  };

  handleClick = (e, titleProps) => {
    const { index } = titleProps;
    const { activeIndex } = this.state;
    const newIndex = activeIndex === index ? -1 : index;
    this.setState({ activeIndex: newIndex });
  };

  runSolution = (solution) => {
    const { testCases, inputConstraint } = this.props.problems;
    const parseCode = (({ sourceCode, language }) => ({
      sourceCode,
      language,
    }))(solution);
    this.setState({ loading: true });
    socketClient.runSolution(
      { ...parseCode, testCases, inputConstraint },
      (result) =>
        this.setState({
          loading: false,
          runStatusList: combineInputResult(testCases, result),
        })
    );
  };

  updateCodeSelection = (selectedLines, callback, solution) => {
    let parsedSolution = (({ userName, timeStamp, language }) => ({
      userName,
      timeStamp,
      language,
    }))(solution);
    this.props.updateCodeSelection(
      { selectedLines, ...parsedSolution },
      callback
    );
  };

  clearRunStatus = () => this.setState({ runStatusList: null });

  render() {
    const { activeIndex, loading, runStatusList } = this.state;
    const { solutions = [] } = this.props;
    return (
      <Segment basic loading={loading}>
        <FloatingPage
          open={!!runStatusList}
          header={"Result"}
          onClick={this.clearRunStatus}
          clickText="ok"
          toggle={this.clearRunStatus}
        >
          <CollapseList lists={runStatusList} title="test case" run={true} />
        </FloatingPage>

        <Accordion fluid styled>
          <Header textAlign="center">Solutions Submitted</Header>

          {solutions.map((solution, index) => (
            <div key={index}>
              <Accordion.Title
                active={activeIndex === index}
                index={index}
                onClick={this.handleClick}
              >
                <Label>Language :</Label> {solution.language}
                <Author
                  userName={solution.userName}
                  date={solution.timeStamp}
                />
              </Accordion.Title>
              <Accordion.Content
                active={activeIndex === index}
                onDoubleClick={() => this.runSolution(solution)}
              >
                <CodeHighlightInteraction
                  solutionCode={solution.sourceCode}
                  language={solution.language}
                  updateCodeSelection={(selectedLines, callback) =>
                    this.updateCodeSelection(selectedLines, callback, solution)
                  }
                />
                <Button
                  size="tiny"
                  color="green"
                  onClick={() => this.runSolution(solution)}
                >
                  run
                </Button>
              </Accordion.Content>
            </div>
          ))}
        </Accordion>
      </Segment>
    );
  }
}

const mapStateToProps = (state) => ({
  solutions: state.Solutions,
  problems: state.Problems,
});

export default connect(mapStateToProps)(SolutionsList);

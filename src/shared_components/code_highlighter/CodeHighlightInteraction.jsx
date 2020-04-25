import React, { Component } from "react";
import CodeHighlight from "./CodeHighlight";
import Styles from "./CodeHighlightInteraction.module.css";

export default class CodeHighlightInteraction extends Component {
  state = {
    selectedLines: [],
    selectedLineNumbers: [],
    eventClassList: [],
  };

  haveSelected = (lineNumber) => {
    let { selectedLineNumbers } = this.state;
    for (let index = 0; index < selectedLineNumbers.length; index++) {
      if (lineNumber === selectedLineNumbers[index]) return index;
    }
    return -1;
  };

  onClear = () => {
    let { eventClassList } = this.state;
    eventClassList.forEach((classList) => {
      classList.remove(Styles.selectedLine);
      classList.add(Styles.lineNumber);
    });
    this.setState({
      selectedLines: [],
      selectedLineNumbers: [],
      eventClassList: [],
    });
  };

  onSelectLineNumber = (event) => {
    let lineNumber = event.target.textContent;
    lineNumber = parseInt(lineNumber.trim());

    let { selectedLineNumbers, selectedLines, eventClassList } = this.state;
    let index = this.haveSelected(lineNumber);

    if (index >= 0) {
      event.target.classList.remove(Styles.selectedLine);
      event.target.classList.add(Styles.lineNumber);

      selectedLineNumbers.splice(index, 1);
      selectedLines.splice(index, 1);
      eventClassList.splice(index, 1);
    } else {
      event.target.classList.add(Styles.selectedLine);
      event.target.classList.remove(Styles.lineNumber);
      eventClassList.push(event.target.classList);

      let { solutionCode } = this.props;

      let selectedLine = solutionCode.split("\n")[lineNumber - 1];
      selectedLines.push(selectedLine);
      selectedLineNumbers.push(lineNumber);
    }
    this.props.updateCodeSelection(selectedLines, this.onClear);
    this.setState({ selectedLineNumbers, selectedLines });
  };
  render() {
    const { solutionCode, language } = this.props;
    return (
      <div className="highlightedBlock">
        <CodeHighlight
          onSelectLineNumber={this.onSelectLineNumber}
          lineClass={Styles.lineNumber}
          solutionCode={solutionCode}
          language={language}
        />
      </div>
    );
  }
}

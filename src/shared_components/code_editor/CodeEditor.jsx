import React, { Component } from "react";
import { ControlledEditor } from "@monaco-editor/react";

// const BAD_WORD = "eval";
// const WARNING_MESSAGE = " <- hey man, what's this?";

export default class CodeEditor extends Component {
  handleEditorChange = (ev, value) => {
    this.props.onCodeChange(value);
    // setValue(
    //   value.includes(BAD_WORD) && !value.includes(WARNING_MESSAGE)
    //     ? value.replace(BAD_WORD, BAD_WORD + WARNING_MESSAGE)
    //     : value.includes(WARNING_MESSAGE) && !value.includes(BAD_WORD)
    //       ? value.replace(WARNING_MESSAGE, "")
    //       : value
    // );
  };

  render() {
    const { language, value, styleClass, height } = this.props;
    return (
      <div className={styleClass}>
        <ControlledEditor
          height={height}
          value={value}
          onChange={this.handleEditorChange}
          language={language}
        />
      </div>
    );
  }
}

import React, { Component } from "react";
import { EditorState, ContentState } from "draft-js";
import { Editor } from "react-draft-wysiwyg";
import "./react-draft-wysiwyg.css";
import Styles from "./TextEditor.module.css";
import { stateToHTML } from "draft-js-export-html";
import htmlToDraft from "html-to-draftjs";

export default class TextEditor extends Component {
  constructor(props) {
    super(props);
    let editorState = this.convertHtmlToEditorState(this.props.editorContent);
    this.state = {
      editorState: editorState,
    };
  }

  convertHtmlToEditorState = (htmlContent) => {
    if (!!htmlContent) {
      const blocksFromHtml = htmlToDraft(htmlContent);
      const { contentBlocks, entityMap } = blocksFromHtml;
      const contentState = ContentState.createFromBlockArray(
        contentBlocks,
        entityMap
      );
      const editorState = EditorState.createWithContent(contentState);
      return editorState;
    } else {
      return EditorState.createEmpty();
    }
  };

  onEditorStateChange = (editorState) => {
    this.setState({ editorState });
    this.props.updateContent(stateToHTML(editorState.getCurrentContent()));
  };
  render() {
    return (
      <div className="problemEditor">
        <Editor
          wrapperClassName={Styles.editor}
          editorClassName={Styles.textArea}
          toolbarClassName={Styles.toolbar}
          placeholder="Write here..."
          editorState={this.state.editorState}
          onEditorStateChange={this.onEditorStateChange}
        />
      </div>
    );
  }
}

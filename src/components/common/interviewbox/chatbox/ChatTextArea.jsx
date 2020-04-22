import { Editor, EditorState, RichUtils, Modifier } from "draft-js";
import React from "react";
import { Button, Icon } from "semantic-ui-react";

import { stateToHTML } from "draft-js-export-html";

import Picker from "emoji-picker-react";
import Styles from "./ChatTextarea.module.css";
import Author from "../../author/Author";

export default class ChatTextArea extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      editorState: EditorState.createEmpty(),
      emojiToggle: false,
    };
  }

  onChange = (editorState) => {
    this.setState({ editorState });
    this.props.onTyping();
  };

  handleKeyCommand = (command, editorState) => {
    const newState = RichUtils.handleKeyCommand(editorState, command);
    if (newState) {
      this.onChange(newState);
      return "handled";
    }
    return "not-handled";
  };

  toogleCode = () => {
    this.onChange(RichUtils.toggleCode(this.state.editorState));
  };

  blockStyleFn = (contentBlock) => {
    const type = contentBlock.getType();
    if (type === "code-block") return Styles.codeBlock;
  };

  focusEditor = () => {
    if (this.editor) {
      this.editor.focus();
    }
  };

  onEmojiToggle = () => this.setState({ emojiToggle: !this.state.emojiToggle });

  insertCharacter = (characterToInsert, editorState) => {
    const currentContent = editorState.getCurrentContent(),
      currentSelection = editorState.getSelection();

    const newContent = Modifier.replaceText(
      currentContent,
      currentSelection,
      characterToInsert
    );

    const newEditorState = EditorState.push(
      editorState,
      newContent,
      "insert-characters"
    );
    return newEditorState;
  };

  onEmojiClick = (event, emojiObject) => {
    const { editorState } = this.state;
    const newEditorState = this.insertCharacter(emojiObject.emoji, editorState);
    this.setState({ editorState: newEditorState, emojiToggle: false });
  };
  sendMessage = () => {
    const { editorState } = this.state;
    this.props.onMessageSend(stateToHTML(editorState.getCurrentContent()));
    this.setState({ editorState: EditorState.createEmpty() });
  };
  render() {
    const { selectedCodeObject, clearCodeSelection } = this.props;
    const { emojiToggle, editorState } = this.state;
    return (
      <div className={Styles.chatUserControl}>
        {emojiToggle && (
          <Picker
            onBlur={this.onEmojiToggle}
            onEmojiClick={this.onEmojiClick}
          />
        )}
        {!!selectedCodeObject.code.length && (
          <div className={Styles.code} onClick={clearCodeSelection}>
            {selectedCodeObject.code}
            <Author
              userName={selectedCodeObject.userName}
              date={selectedCodeObject.timeStamp}
            />
          </div>
        )}

        <div className={Styles.chatInput}>
          <div className={Styles.leftBtns}>
            <Button icon size="mini" onClick={this.onEmojiToggle}>
              <Icon name="meh" />
            </Button>
            <Button icon size="mini" onClick={this.toogleCode}>
              <Icon name="code" />
            </Button>
          </div>
          <div className={"draftArea"} onClick={this.focusEditor}>
            <Editor
              placeholder="Write here ..."
              ref={(editor) => (this.editor = editor)}
              editorState={editorState}
              handleKeyCommand={this.handleKeyCommand}
              onChange={this.onChange}
              blockStyleFn={this.blockStyleFn}
            />
          </div>
          <Button color="green" size="small" icon onClick={this.sendMessage}>
            <Icon name="send" />
          </Button>
        </div>
      </div>
    );
  }
}

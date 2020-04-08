import React, { Component } from "react";
import { Comment, Segment } from "semantic-ui-react";
import Styles from "./MessageBox.module.css";
import CodeHighlightInteraction from "../../editor/CodeHighlightInteraction";
import { formatDate } from "../../../../utils/DateFormater";

//redux
import { connect } from "react-redux";
import Author from "../../author/Author";

const myselfAlign = (userName1, userName2) =>
  userName1 === userName2 ? "right" : "left";
const myselfStyle = (userName1, userName2) =>
  userName1 === userName2
    ? {
        paddingTop: "0px",
        paddingBottom: "0px",
        borderRight: "2px solid #00CB54",
      }
    : {
        paddingTop: "0px",
        paddingBottom: "0px",
        borderLeft: "2px solid black",
      };
const codeAlign = (userName1, userName2) =>
  userName1 === userName2 ? Styles.codeBlockRight : Styles.codeBlockLeft;

class MessageBox extends Component {
  constructor(props) {
    super(props);
    this.boxRef = React.createRef();
  }
  scrollToBottom = () => {
    this.boxRef.current.scrollTop = this.boxRef.current.scrollHeight;
  };

  componentDidUpdate = () => {
    this.scrollToBottom();
  };

  render() {
    const { messageList, typingUser } = this.props;
    const userName = sessionStorage.getItem("userName");
    return (
      <div className={Styles.messageBox} ref={this.boxRef}>
        <Comment.Group size="mini">
          {messageList.map((messageObject, index) => (
            <Segment
              key={index}
              textAlign={myselfAlign(messageObject.userName, userName)}
              basic
              size="small"
              style={myselfStyle(messageObject.userName, userName)}
            >
              <Comment key={index}>
                <Comment.Content>
                  <Comment.Author as="a">
                    {messageObject.userName}
                  </Comment.Author>
                  <Comment.Metadata>
                    <div>{formatDate(messageObject.timeStamp)}</div>
                  </Comment.Metadata>
                  <Comment.Text>
                    {!!messageObject.solution.code && (
                      <div
                        className={codeAlign(messageObject.userName, userName)}
                      >
                        <CodeHighlightInteraction
                          solutionCode={messageObject.solution.code}
                          language={messageObject.solution.language}
                          updateCodeSelection={(selectedLines, callback) =>
                            this.props.updateCodeSelection(
                              { selectedLines, ...messageObject.solution },
                              callback
                            )
                          }
                        />
                        <Author
                          userName={messageObject.solution.userName}
                          date={messageObject.solution.timeStamp}
                        />
                      </div>
                    )}
                    <div
                      className="myMessage"
                      dangerouslySetInnerHTML={{ __html: messageObject.text }}
                    />
                  </Comment.Text>
                </Comment.Content>
              </Comment>
            </Segment>
          ))}
          {!!typingUser && (
            <Segment
              textAlign="left"
              basic
              size="small"
              style={myselfStyle("", typingUser)}
            >
              <Comment>
                <Comment.Content>
                  <Comment.Author as="a">{typingUser}</Comment.Author>
                  <Comment.Text>
                    <div class="ui mini active inline loader" /> typing
                  </Comment.Text>
                </Comment.Content>
              </Comment>
            </Segment>
          )}
        </Comment.Group>
      </div>
    );
  }
}

const mapStateToProps = (state) => ({
  messageList: state.Messages,
});

export default connect(mapStateToProps)(MessageBox);

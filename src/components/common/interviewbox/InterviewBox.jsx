import React from "react";
import { Tab, Menu, Label, Icon } from "semantic-ui-react";
import Chatbox from "./chatbox/Chatbox";
import Problemsbox from "./problembox/Problemsbox";
import Solutionbox from "./solutionbox/SolutionBox";
import UserProfile from "./userbox/UserProfile";
import Styles from "./InterviewBox.module.css";
import { connect } from "react-redux";

class InterviewBox extends React.Component {
  state = {
    selectedCodeObject: {
      selectedLines: [],
      userName: "",
      timeStamp: new Date(),
      language: "javascript",
    },
    clearCodeSelctionFormat: null,
    activeIndex1: 0,
    activeIndex2: 0,
  };

  updateCodeSelection = (selectedCodeObject, clearCallback) => {
    const { clearCodeSelctionFormat } = this.state;

    if (!!clearCodeSelctionFormat && clearCodeSelctionFormat !== clearCallback)
      clearCodeSelctionFormat();
    this.setState({
      selectedCodeObject,
      clearCodeSelctionFormat: clearCallback,
    });
  };

  clearSelectedLines = () =>
    this.setState({
      selectedCodeObject: {
        selectedLines: [],
        userName: "",
        timeStamp: new Date(),
        language: "javascript",
      },
    });

  getNotify1 = (numbers, index) => {
    const { activeIndex1 } = this.state;
    return !!numbers && index !== activeIndex1 ? (
      <span className={Styles.notify}>{numbers}</span>
    ) : (
      <span className={Styles.NoNotify}>{numbers}</span>
    );
  };

  getNotify2 = (numbers, index) => {
    return !!numbers ? (
      <span className={Styles.notify}>{numbers}</span>
    ) : (
      <span className={Styles.NoNotify}>{numbers}</span>
    );
  };

  getPanes1 = () => {
    const { message, problem } = this.props.notifications;

    return [
      {
        menuItem: (
          <Menu.Item key="Chat">
            <Icon name="talk" />
            Chat
            {this.getNotify1(message, 0)}
          </Menu.Item>
        ),
        render: () => (
          <Tab.Pane className="chat-pane">
            <Chatbox
              clearSelectedLines={this.clearSelectedLines}
              clearCodeSelctionFormat={this.state.clearCodeSelctionFormat}
              updateCodeSelection={this.updateCodeSelection}
              selectedCodeObject={this.state.selectedCodeObject}
            />
          </Tab.Pane>
        ),
      },
      {
        menuItem: (
          <Menu.Item key="Problem1">
            <Icon name="tasks" />
            Problem
            {this.getNotify1(problem, 1)}
          </Menu.Item>
        ),
        render: () => (
          <Tab.Pane>
            <Problemsbox />
          </Tab.Pane>
        ),
      },
    ];
  };

  getPanes2 = () => {
    const { problem, solution } = this.props.notifications;
    return [
      {
        menuItem: (
          <Menu.Item key="Problem2">
            <Icon name="tasks" />
            Problem
            {this.getNotify2(problem, 0)}
          </Menu.Item>
        ),
        render: () => (
          <Tab.Pane>
            <Problemsbox />
          </Tab.Pane>
        ),
      },
      {
        menuItem: (
          <Menu.Item key="Solution">
            <Icon name="lightbulb" />
            Solution
            {this.getNotify2(solution, 1)}
          </Menu.Item>
        ),
        render: () => (
          <Tab.Pane>
            <Solutionbox updateCodeSelection={this.updateCodeSelection} />
          </Tab.Pane>
        ),
      },
      {
        menuItem: (
          <Menu.Item key="Session">
            <Icon name="user" />
            {this.props.user.userName}
            <span className={Styles.NoNotify}>0</span>
          </Menu.Item>
        ),
        render: () => (
          <Tab.Pane>
            <UserProfile />
          </Tab.Pane>
        ),
      },
    ];
  };

  render() {
    return (
      <div className={Styles.interviewBox}>
        <Tab
          className="tabpane"
          menu={{ size: "mini", secondary: true, pointing: true }}
          panes={this.getPanes1()}
          onTabChange={(e, { activeIndex }) =>
            this.setState({ activeIndex1: activeIndex })
          }
        />
        <Tab
          className="tabpane"
          menu={{ size: "mini", secondary: true, pointing: true }}
          panes={this.getPanes2()}
          onTabChange={(e, { activeIndex }) =>
            this.setState({ activeIndex2: activeIndex })
          }
        />
      </div>
    );
  }
}

const mapStateToProps = (state) => ({
  notifications: state.Notifications,
  user: state.User,
});

export default connect(mapStateToProps)(InterviewBox);

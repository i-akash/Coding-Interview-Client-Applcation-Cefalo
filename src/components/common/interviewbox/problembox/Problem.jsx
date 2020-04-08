import React, { Component } from "react";
import Styles from "./Problembox.module.css";
import { Header, Label, Segment } from "semantic-ui-react";
import Author from "../../author/Author";

class Problem extends Component {
  state = {
    userName: "",
    title: "",
    problemStatement: "",
    inputConstraint: {},
    timeStamp: new Date(),
  };
  componentDidMount = () => {
    const { problem } = this.props;
    this.setState({ ...problem });
  };

  componentWillReceiveProps = (nextProps) => {
    const { problem } = nextProps;
    this.setState({ ...problem });
  };

  render() {
    const {
      userName,
      title,
      problemStatement,
      inputConstraint,
      timeStamp,
    } = this.state;

    return (
      <div>
        {!!problemStatement === false ? (
          <Segment>No Problem Set yet !!</Segment>
        ) : (
          <Segment>
            <Header textAlign="center">{title}</Header>
            <Author userName={userName} date={timeStamp} />
            <Label basic>Statement</Label>

            <div
              className={Styles.problem}
              dangerouslySetInnerHTML={{ __html: problemStatement }}
            ></div>
            <Label basic>Input Constraint</Label>
            <Segment basic>
              {Object.keys(inputConstraint).map((ic, index) => (
                <div>
                  <Label key={index}>{`${ic} : ${inputConstraint[ic]}`}</Label>
                </div>
              ))}
            </Segment>
          </Segment>
        )}
      </div>
    );
  }
}

export default Problem;

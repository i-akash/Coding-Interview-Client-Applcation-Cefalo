import React, { Component } from "react";
import Styles from "./Problembox.module.css";
import { Header, Label, Segment, Grid } from "semantic-ui-react";
import Author from "../../shared_components/author/Author";

const initState = {
  userName: "",
  title: "",
  problemStatement: "",
  inputConstraint: {},
  timeStamp: new Date(),
};

class Problem extends Component {
  state = { ...initState };

  componentDidMount = () => {
    const { problem } = this.props;
    this.setState({ ...problem });
  };

  componentWillReceiveProps = (nextProps) => {
    const { problem } = nextProps;
    console.log(!!problem.inputConstraint);
    if (!!problem.title) this.setState({ ...problem });
    else this.setState({ ...initState });
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
        {!!title === false ? (
          <Segment basic secondary>
            No Problem Set yet !!
          </Segment>
        ) : (
          <Segment basic>
            <Grid>
              <Grid.Row columns={1} stretched>
                <Grid.Column>
                  <Header textAlign="center">{title}</Header>
                </Grid.Column>
              </Grid.Row>
              <Grid.Row columns={1}>
                <Grid.Column>
                  <Author userName={userName} date={timeStamp} />
                </Grid.Column>
              </Grid.Row>
              <Grid.Row columns={1} stretched>
                <Grid.Column>
                  <div
                    className={Styles.problem}
                    dangerouslySetInnerHTML={{ __html: problemStatement }}
                  ></div>
                </Grid.Column>
              </Grid.Row>
              <Grid.Row columns={1}>
                <Grid.Column>
                  <Header as="h5">Input Constraint</Header>
                  {Object.keys(inputConstraint).map((ic, index) => (
                    <div>
                      <Label
                        style={{ width: "100%", borderRadius: "0" }}
                        key={index}
                      >{`${ic} : ${inputConstraint[ic]}`}</Label>
                    </div>
                  ))}
                </Grid.Column>
              </Grid.Row>
            </Grid>
          </Segment>
        )}
      </div>
    );
  }
}

export default Problem;

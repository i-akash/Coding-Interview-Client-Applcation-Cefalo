import React, { Component } from "react";
import { Accordion, Header, Button, Icon, Label } from "semantic-ui-react";

const getIcon = (status, run = false) => {
  if (!run) return "folder";
  if (status.accepted) return "check";
  if (!status.accepted) return "close";
};

const getColor = (status, run = false) => {
  if (!run) return "gray";
  if (status.accepted) return "green";
  if (!status.accepted) return "red";
};

export default class CollapseList extends Component {
  state = { activeIndex: -1 };

  handleClick = (e, titleProps) => {
    const { index } = titleProps;
    const { activeIndex } = this.state;
    const newIndex = activeIndex === index ? -1 : index;

    this.setState({ activeIndex: newIndex });
  };

  render() {
    const { header, lists, run, title } = this.props;
    const { activeIndex } = this.state;
    return (
      <Accordion styled>
        <Header textAlign="center">{header}</Header>
        {lists.map((item, index) => (
          <div key={index}>
            <Accordion.Title
              active={activeIndex === index}
              index={index}
              onClick={this.handleClick}
            >
              <Icon name={getIcon(item, run)} color={getColor(item, run)} />
              {`${title} ${index}`}
            </Accordion.Title>
            <Accordion.Content active={activeIndex === index}>
              <Label basic>
                <Icon name="file" />
                Input : {item.input}
              </Label>
              <br />
              <Label basic>
                <Icon name="file" />
                Output : {item.output}
              </Label>
            </Accordion.Content>
          </div>
        ))}
      </Accordion>
    );
  }
}

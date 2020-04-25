import React, { Component } from "react";
import { Dropdown } from "semantic-ui-react";

const onDefaultFocus = () => {};

export default class SelectOrCreate extends Component {
  state = {
    searchQuery: "",
    value: "",
    options: [],
  };

  componentDidMount = () => {
    const { options } = this.props;
    this.setState({ options });
  };

  componentWillReceiveProps = (nextProps) => {
    if (nextProps.options !== this.props.options)
      this.setState({ options: nextProps.options });
  };

  handleAddition = (e, { value }) => {
    this.setState((prevState) => ({
      options: [
        ...prevState.options,
        {
          key: prevState.options.length,
          text: value,
          value: prevState.options.length,
        },
      ],
    }));
  };

  handleChange = (e, { value, options }) => {
    if (typeof value === "string") {
      let key = options.length;
      this.setState({ value: key });
      this.props.onSelect({ key, text: value, value: key });
      return;
    }
    this.setState({ value });
    this.props.onSelect(options[value]);
  };

  render() {
    const { value, options } = this.state;
    const {
      placeholder,
      onFocus = onDefaultFocus,
      allowAdditions = true,
    } = this.props;
    return (
      <div style={{ margin: "2px", marginRight: "0px" }}>
        <Dropdown
          onFocus={onFocus}
          options={options}
          placeholder={placeholder}
          fluid
          search
          selection
          allowAdditions={allowAdditions}
          value={value}
          onAddItem={this.handleAddition}
          onChange={this.handleChange}
        />
      </div>
    );
  }
}

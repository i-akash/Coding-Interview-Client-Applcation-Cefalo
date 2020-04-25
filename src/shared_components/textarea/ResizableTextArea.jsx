import React from "react";

// css
import Styles from "./ResizableTextArea.module.css";

export default class ResizableTextarea extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      rows: this.props.rows,
      minRows: this.props.minRows,
      maxRows: this.props.maxRows,
    };
  }

  handleChange = (event) => {
    const textareaLineHeight = 18;
    const { minRows, maxRows } = this.state;

    const previousRows = event.target.rows;
    event.target.rows = minRows; // reset number of rows in textarea

    const currentRows = ~~(event.target.scrollHeight / textareaLineHeight);

    if (currentRows === previousRows) {
      event.target.rows = currentRows;
    }

    if (currentRows >= maxRows) {
      event.target.rows = maxRows;
      event.target.scrollTop = event.target.scrollHeight;
    }

    this.setState({
      rows: currentRows < maxRows ? currentRows : maxRows,
    });

    this.props.onChange(event);
  };

  render() {
    const { name, value, placeholder } = this.props;
    return (
      <textarea
        name={name}
        rows={this.state.rows}
        value={value}
        placeholder={placeholder}
        className={Styles.textarea}
        onChange={this.handleChange}
      ></textarea>
    );
  }
}

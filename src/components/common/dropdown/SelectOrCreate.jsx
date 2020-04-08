import React, { Component } from 'react'
import { Dropdown } from 'semantic-ui-react'


const onDefaultFocus = () => { }


export default class SelectOrCreate extends Component {

    state = {
        searchQuery: '',
        value: "",
        options: []
    }

    componentDidMount = () => {
        const { options } = this.props
        this.setState({ options })
    }

    componentWillReceiveProps = (nextProps) => {
        if (nextProps.options !== this.props.options)
            this.setState({ options: nextProps.options })

    }

    handleAddition = (e, { value }) => {
        this.setState((prevState) => ({
            options: [{ text: value, value }, ...prevState.options],
        }))
    }

    handleChange = (e, { value }) => {
        this.setState({ value })
        this.props.onSelect(value)
    }

    render() {
        const { value, options } = this.state
        const { placeholder, onFocus } = this.props
        return (
            <div style={{ margin: "2px", marginRight: '0px' }}>
                <Dropdown
                    onFocus={onFocus || onDefaultFocus}
                    options={options}
                    placeholder={placeholder}
                    fluid
                    search
                    selection
                    allowAdditions
                    value={value}
                    onAddItem={this.handleAddition}
                    onChange={this.handleChange}
                />
            </div>

        )
    }
}

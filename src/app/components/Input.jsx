import React, { Component } from 'react';

export default class Input extends Component {
  constructor(props) {
    super(props);
    this.state = {
      val: this.props.val || ''
    };
  }

  inputTemplates = {
    text: (path, val, handleChange, className, props)=>(
      <input
        className={"Input" + className}
        type="text"
        key={path}
        data-model={path}
        val={val}
        handleChange={this.handleChange}
      />
    ),
    textarea: (path, val, handleChange, className, props)=>(
      <textarea
        className={"Input Input--textarea" + className}
        data-model={path}
        key={path}
        defaultValue={val}
        handleChange={this.handleChange}
      ></textarea>
    ),
    checkbox: (path, val, handleChange, className, props)=>(
      <input
        className={"Input Input--checkbox" + className}
        type="checkbox"
        key={path}
        data-model={path}
        defaultChecked={!!val}
        handleChange={this.handleChange}
      />
    )
  }

  handleChange(event) {
    this.props.handleChange(event.target.value)
    this.setState({val: event.target.value});
  }

  componentWillReceiveProps(nextProps) {
    nextProps.hasOwnProperty("val") && this.setState({val: nextProps.val});
  }

  render() {
    const val = this.state.val;
    const { handleChange = ()=>{null}, type, path, className, ...props } = this.props;
    return type in this.inputTemplates ? this.inputTemplates[type](path, val, handleChange, className ? ' ' + className : '', props) : null;
  }
}

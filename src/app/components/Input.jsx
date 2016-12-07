import React, { Component } from 'react';

export default class Input extends Component {
  constructor(props) {
    super(props);
    this.handleChange = this.handleChange.bind(this);
  }

  inputTemplates = {
    text: (path, val, handleChange, className, props)=>(
      <input
        className={"Input" + className}
        type="text"
        key={path}
        data-model={path}
        value={val}
        onChange={this.handleChange}
      />
    ),
    textarea: (path, val, handleChange, className, props)=>(
      <textarea
        className={"Input Input--textarea" + className}
        data-model={path}
        key={path}
        value={val}
        onChange={this.handleChange}
      ></textarea>
    ),
    checkbox: (path, val, handleChange, className, props)=>(
      <input
        className={"Input Input--checkbox" + className}
        type="checkbox"
        key={path}
        data-model={path}
        checked={!!val}
        onChange={this.handleChange}
      />
    )
  }

  handleChange(event) {
    this.props.handleChange(event.target.value);
  }

  render() {
    const { val, handleChange = ()=>{null}, type, path, className, ...props } = this.props;
    return type in this.inputTemplates ? this.inputTemplates[type](path, val, handleChange, className ? ' ' + className : '', props) : null;
  }
}

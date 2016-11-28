import React, { Component } from 'react';

export default class Input extends Component {
  getInitialState: function() {
    return {text: this.props.val || ''};
  },
  getInitialProps: function() {
    return { handleChange: ()=>(null) }
  },
  handleChange: function(event) {
    this.props.handleChange(event.target.value)
    this.setState({text: event.target.value});
  },
  componentWillReceiveProps: function(nextProps) {
    nextProps.hasOwnProperty("val") && this.setState({text: nextProps.val});
  },
  render: function() {
    var text = this.state.text;
    return <input value={text} onChange={this.handleChange} { ...this.props } />;
  }
});

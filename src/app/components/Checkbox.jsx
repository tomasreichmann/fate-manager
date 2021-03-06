import React, { Component } from 'react';
import Input from './Input';

export default function Checkbox({ superscript, label, disabled, checked, handleChange = ()=>{}, ...props }){
  const disabledProp = disabled ? { disabled: 'disabled' } : {};
  const disabledClass = disabled ? ' Checkbox--disabled' : '';
  return (<label className={"Checkbox" + disabledClass} >
    <Input className="Checkbox-input" type="checkbox" handleChange={handleChange} val={checked} {...props} {...disabledProp} />
    <span className="Checkbox-label">
      {label}
    </span>
  </label>);
}

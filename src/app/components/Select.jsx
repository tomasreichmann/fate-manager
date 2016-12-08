import React, { Component } from 'react';
import { capitalizeFirstLetter as capFirst } from '../utils/utils';


export default function Select({ options = [], value, handleChange = ()=>(null), ...props }){
  function onChange(event){
    handleChange(event.target.value);
    event.preventDefault();
  }
  return (<select className="Select" value={value} onChange={onChange} >
    { options.map( (option, index)=>(
      <option value={option.value} key={"option-"+index} >{capFirst(option.label)}</option>
    ) ) }
  </select>);
}

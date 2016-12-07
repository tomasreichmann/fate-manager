import React, { Component } from 'react';
import { capitalizeFirstLetter as capFirst } from '../utils/utils';

export default function Select({ options = [], value, handleChange = ()=>(null), ...props }){
  return (<select className="Select" value={value} onChange={handleChange} >
    { options.map( (option, index)=>(
      <option value={option.value} key={"option-"+index}>{capFirst(option.label)}</option>
    ) ) }
  </select>);
}

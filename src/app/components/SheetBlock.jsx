import React, { Component } from 'react';
import { capitalizeFirstLetter as capFirst } from '../utils/text';

export default function SheetBlock({ name, ...props }){
  return (<div className="SheetBlock" >
    <h2>{name}</h2>
  </div>);
}

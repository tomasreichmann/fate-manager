import React, { Component } from 'react';
import { capitalizeFirstLetter as capFirst, seq, getIn, intersperse } from '../utils/utils';
import Input from './Input';
import Checkbox from './Checkbox';

function getInput(type, path, data, def){
  const val = def || getIn(data, path);
  return <Input type={type} handleChange={handleChange} val={val} />;
};

function handleChange(newVal){
  def = def || type === "checkbox" ? false : "";
  let character = data.viewData.id !== undefined && data.characters.find( (item) => ( item.id === data.viewData.id ) ) || {};
  // TODO handle change
}

export default function SheetBlock({ template, dictionary: text, onStressChange = ()=>{}, ...sheet }){
  const { name, aspects, skills, refresh, stunts, extras } = sheet;

  let aspectSpans = [];
  "main" in aspects && aspectSpans.push(<strong className="SheetBlock-aspects-main" key="SheetBlock-aspects-main" >{ aspects.main }</strong>);
  "trouble" in aspects && aspectSpans.push(<span className="SheetBlock-aspects-trouble" key="SheetBlock-aspects-trouble" >{ aspects.trouble }</span>);
  "3" in aspects && aspectSpans.push(<span className="SheetBlock-aspects-3" key="SheetBlock-aspects-3" >{ aspects[3] }</span>);
  "4" in aspects && aspectSpans.push(<span className="SheetBlock-aspects-4" key="SheetBlock-aspects-4" >{ aspects[4] }</span>);
  "5" in aspects && aspectSpans.push(<span className="SheetBlock-aspects-5" key="SheetBlock-aspects-5" >{ aspects[5] }</span>);

  const aspectBlock = aspectSpans.length && Object.keys(aspects).length > 0 ? (
    <p className="SheetBlock-aspects" >
    {intersperse(aspectSpans,', ')}
    </p>
  ) : null;

  const bonusConsequences = (template.consequences.skills.reduce((maxLevel, skill)=>(
    Math.max( maxLevel, sheet.skills[skill] || 0 )
  ), 0 ) >= template.consequences.bonusSkillLevel)*1;

  const refreshNote = refresh ? <span className="SheetBlock-note" >{capFirst(text.refresh)}: {refresh}</span> : null;

  const skillList = Object.keys(skills)
    .sort( (skillA, skillB)=>(
      skills[skillB] - skills[skillA] || ~~(skillA > skillB)
    ) )
    .map( (skill)=>( text[skill] + ' ' + skills[skill] ) )
    .join(', ')
  ;
  const totalSkillLevels = Object.keys(skills).reduce( (result, skill)=>( result += skills[skill] ), 0 )
  const skillBlock = totalSkillLevels > 0 ? <div className="SheetBlock-skills" >
    <h3>{capFirst(text.skills)} <span className="SheetBlock-note" >{totalSkillLevels}</span></h3>
    <p>{skillList}</p>
  </div> : null;

  const maxConsequences = template.consequences.defaultCount + bonusConsequences;

  const stuntsBlock = stunts && stunts.length ? <div className="SheetBlock-stunts" >
    <h3>{capFirst(text.stunts)} <span className="SheetBlock-note" >{stunts.length}</span></h3>
    {stunts.map( (stunt, index)=>( <p key={"stunt-"+index} >{stunt}</p> ) )}
  </div> : null;

  const extrasBlock = extras && extras.length ? <div className="SheetBlock-extras" >
    <h3>{capFirst(text.extras)} <span className="SheetBlock-note" >{extras.length}</span></h3>
    {extras.map( (extra, index)=>( <p key={"extra-"+index} >{extra}</p> ) )}
  </div> : null;

  const stressBlock = template.stress && template.stress.length ? (
    <div className="SheetBlock-stress" >{template.stress.map( (stress)=>{
      let maxStress = stress.def;
      if(stress.skill in skills){
        maxStress = maxStress + (skills[stress.skill] >= 3 ? 2 : 1);
      }
      return <div className="stressLane" key={"stressLane-"+stress.label} ><h2><span>{text[stress.label]}</span> <span className="SheetBlock-note">({text[stress.skill]})</span></h2>
        <div className="stress">
        { seq(stress.count).map( (stressBox, index)=>(
          <Checkbox key={"stressBox-"+index} label={ <span className="SheetBlock-superscript" >{index+1}</span> } disabled={index >= maxStress} />
        ) ) }
        </div>
      </div>
    } )}</div>
  ) : null;

  const consequenceBlock = template.consequences && template.consequences.list.length ? (
    <div className="SheetBlock-consequences" >
      <h2>{text.consequences}</h2>
      <div>{template.consequences.list.map( (consequence, index)=>(
        <label key={consequence.key} className={"SheetBlock-consequence" + (index >= maxConsequences ? " disabled" : "")}>
          <i className="SheetBlock-superscript" >{consequence.val}</i>
          <span>{capFirst(text[consequence.label])}</span>
          {getInput("text",consequence.key, sheet)}
        </label>
      ) )}</div>
    </div>
  ) : null;

  return (<div className="SheetBlock" >
    <h2 className="SheetBlock-name" ><span>{sheet.name}</span>{refreshNote}</h2>
    {aspectBlock}
    {skillBlock}
    {stuntsBlock}
    {extrasBlock}
    {stressBlock}
    {consequenceBlock}
  </div>);
}

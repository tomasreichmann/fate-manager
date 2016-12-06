import React, { Component } from 'react';
import { capitalizeFirstLetter as capFirst, seq, getIn, intersperse } from '../utils/utils';
import Input from './Input';
import Checkbox from './Checkbox';

function getInput(type, path, data, def){
  const val = def || getIn(data, path);
  return <Input type={type} handleChange={handleChange} val={val} />;
};

function handleChange(newVal){

}

export default function SheetEditor({ template, dictionary: text, onStressChange = ()=>{}, ...sheet }){
  const { name, aspects, skills, refresh, stunts } = sheet;

  let aspectSpans = [];
  "main" in aspects && aspectSpans.push(<strong className="SheetEditor-aspects-main" key="SheetEditor-aspects-main" >{ aspects.main }</strong>);
  "trouble" in aspects && aspectSpans.push(<span className="SheetEditor-aspects-trouble" key="SheetEditor-aspects-trouble" >{ aspects.trouble }</span>);
  "3" in aspects && aspectSpans.push(<span className="SheetEditor-aspects-3" key="SheetEditor-aspects-3" >{ aspects[3] }</span>);
  "4" in aspects && aspectSpans.push(<span className="SheetEditor-aspects-4" key="SheetEditor-aspects-4" >{ aspects[4] }</span>);
  "5" in aspects && aspectSpans.push(<span className="SheetEditor-aspects-5" key="SheetEditor-aspects-5" >{ aspects[5] }</span>);

  const aspectBlock = aspectSpans.length && Object.keys(aspects).length > 0 ? (
    <p className="SheetEditor-aspects" >
    {intersperse(aspectSpans,', ')}
    </p>
  ) : null;

  const bonusConsequences = (template.consequences.skills.reduce((maxLevel, skill)=>(
    Math.max( maxLevel, sheet.skills[skill] || 0 )
  ), 0 ) >= template.consequences.bonusSkillLevel)*1;

  const refreshNote = refresh ? <span className="SheetEditor-note" >{capFirst(text.refresh)}: {refresh}</span> : null;

  const skillList = Object.keys(skills)
    .sort( (skillA, skillB)=>(
      skills[skillB] - skills[skillA] || ~~(skillA > skillB)
    ) )
    .map( (skill)=>( text[skill] + ' ' + skills[skill] ) )
    .join(', ')
  ;
  const totalSkillLevels = Object.keys(skills).reduce( (result, skill)=>( result += skills[skill] ), 0 )
  const skillBlock = totalSkillLevels > 0 ? <div className="SheetEditor-skills" >
    <h3>{capFirst(text.skills)} <span className="SheetEditor-note" >{totalSkillLevels}</span></h3>
    <p>{skillList}</p>
  </div> : null;

  const maxConsequences = template.consequences.defaultCount + bonusConsequences;

  const stuntsBlock = stunts && stunts.length ? <div className="SheetEditor-stunts" >
    <h3>{capFirst(text.stunts)} <span className="SheetEditor-note" >{stunts.length}</span></h3>
    {stunts.map( (stunt, index)=>( <p key={"stunt-"+index} >{stunt}</p> ) )}
  </div> : null;

  const stressBlock = template.stress && template.stress.length ? (
    <div className="SheetEditor-stress" >{template.stress.map( (stress)=>{
      let maxStress = stress.def;
      if(stress.skill in skills){
        maxStress = maxStress + (skills[stress.skill] >= 3 ? 2 : 1);
      }
      return <div className="stressLane" key={"stressLane-"+stress.label} ><h2><span>{text[stress.label]}</span> <span className="SheetEditor-note">({text[stress.skill]})</span></h2>
        <div className="stress">
        { seq(stress.count).map( (stressBox, index)=>(
          <Checkbox key={"stressBox-"+index} label={ <span className="SheetEditor-superscript" >{index+1}</span> } disabled={index >= maxStress} />
        ) ) }
        </div>
      </div>
    } )}</div>
  ) : null;

  const consequenceBlock = template.consequences && template.consequences.length ? (
    <div className="SheetEditor-consequences" >
      <h2>{text.consequences}</h2>
      <div>{template.consequences.list.map( (consequence, index)=>(
        <label key={consequence.key} className={"input-wrap" + (index >= maxConsequences ? " disabled" : "")}>
          <i className="SheetEditor-superscript" >{consequence.val}</i>
          <span>{consequence.label}</span>
          {getInput("text",consequence.key, sheet)}
        </label>
      ) )}</div>
    </div>
  ) : null;

  return (<div className="SheetEditor" >
    <div className="row mb-sm">
      <div className="col-xs-12 col-sm-8">
        <div className="row mb-sm">
          <div className="col-xs-12 col-sm-12"><h2>{text.id}</h2></div>
          <div className="col-xs-12 col-sm-9 name-column">
            <label className="input-wrap name mb-sm"><span>{text.name}</span>{getInput("text", "name", sheet)}</label>
            <div className="description mb-sm" ><label className="textarea-wrap"><span>{text.description}</span>{getInput("textarea", "description", sheet)}</label></div>
          </div>
          <div className="col-xs-12 col-sm-3 refresh mb-sm">
            <label className="textarea-wrap"><span>{text.refresh}</span>{getInput("textarea", "refresh", sheet)}</label>
          </div>

        </div>
      </div>
      <div className="col-xs-12 col-sm-4 logo mb-sm">
        <img src="http://3.bp.blogspot.com/-bJjDZ-FtpHQ/ULRW6uKF3JI/AAAAAAAAAh8/PRrdYkH2fi8/s1600/Fate%2BCore%2BCover.png" alt="FATE core system" />
      </div>

    </div>
    <div className="row mb">
      <div className="col-xs-12 col-sm-5 aspects">
        <h2>{text.aspects}</h2>
        <label className="input-wrap"><span>{text.mainAspect}</span>{getInput("text", "aspects.main", sheet)}</label>
        <label className="input-wrap"><span>{text.trouble}</span>{getInput("text", "aspects.trouble", sheet)}</label>
        <label className="input-wrap">{getInput("text", "aspects.3", sheet)}</label>
        <label className="input-wrap">{getInput("text", "aspects.4", sheet)}</label>
        <label className="input-wrap">{getInput("text", "aspects.5", sheet)}</label>
      </div>
      <div className="col-xs-12 col-sm-7 skills">
        <h2>{text.skills}</h2>
        { false && seq(template.skillLevels).reverse().map( (level) =>{
          return <div className="row">
            <div className="col-xs-12 col-sm-2">{template.challengeLevels[level]}&nbsp;(+{level+1})</div>
            { seq(template.skillsPerLevel).map( (column)=>{
              let currentPath = "skills.level"+(level+1)+".column"+(column+1);
              let val = getIn(sheet, currentPath);
              let inputState = "skill-valid";
              let title;
              if( level !== 0 ){
                let lowerSkillCount = Immutable.fromJS( getIn(sheet,  "skills.level"+(level) ) || {} ).toArray().filter( (val)=>( !!val ) ).length;
                if( column >= lowerSkillCount) {
                  if(!!val){
                    inputState = "skill-invalid";
                    title = "This exceeds maximum number of skills on this level";
                  } else {
                    inputState = "skill-locked";
                    title = "Maximum number of skills on this level reached";
                  }
                }
              }
              return <div className="col-xs-12 col-sm-2"><label className={"input-wrap " + inputState} title={title} >{getInput("text", currentPath, sheet)}<div className="skill-list" > {[text.clear].concat(template.skillList).map( (skill)=>( <button onClick={ fillSkill.bind({ level: "level"+(level+1), column: "column"+(column+1), skill: (skill === text.clearText ? "" : skill), sheet}) } >{skill}</button> ) )}</div></label></div>
            } ) }
          </div> } ) }
      </div>
    </div>
    <div className="row mb">
      <div className="col-xs-12 col-sm-6">
        <h2>{text.extras}</h2>
        <div className="extras" >{getInput("textarea", "extras", sheet)}</div>
      </div>
      <div className="col-xs-12 col-sm-6">
        <h2>{text.stunts}</h2>
        <div className="stunts" >{getInput("textarea", "stunts", sheet)}</div>
      </div>
    </div>
    <div className="row">
      <div className="col-xs-12 col-sm-4">
        { template.stress.map( (stress)=>{
          let maxStress = stress.def;
          if(stress.skill in skills){
            maxStress = maxStress + (skills[stress.skill] >= 3 ? 2 : 1);
          }
          return <div className="stress-lane" ><h2>{stress.label} <span className="note">({stress.skill})</span></h2>
            <div className="stress">
            { seq(stress.count).map( (stressBox, index)=>(
              <label className={ "checkbox" + ((index >= maxStress) ? " disabled" : "") } ><span><i className="superscript">{index+1}</i></span>{getInput("checkbox", "stress."+stress.key+"."+(index+1), sheet)}<s></s></label>
            ) ) }
            </div>
          </div>
        } ) }
      </div>
      <div className="col-xs-12 col-sm-8 consequences">
        <h2>{text.consequences}</h2>
        <div>{template.consequences.list.map( (consequence, index)=>(
          <label key={consequence.key} className={"input-wrap" + (index >= maxConsequences ? " disabled" : "")}><i className="superscript" >{consequence.val}</i><span>{consequence.label}</span>{getInput("text",consequence.key, sheet)}</label>
          ) )}</div>
      </div>
    </div>;



    {aspectBlock}
    {skillBlock}
    {stuntsBlock}
    {stressBlock}
    {consequenceBlock}
  </div>);
}

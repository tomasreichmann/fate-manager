import React, { Component } from 'react';
import { capitalizeFirstLetter as capFirst, seq, getIn, intersperse } from '../utils/utils';
import Input from './Input';
import Checkbox from './Checkbox';
import Select from './Select';


export default function SheetEditor({ template, dictionary: text, handleChange = ()=>{}, ...sheet }){
  const { name, aspects, skills, refresh, stunts, extras } = sheet;

  const handleSkillChange = (level, index, levelSkills, value)=>{
    console.log("handleSkillChange");
    const newSkills = skills;
    // TODO
    // return handleChange('skills', newSkills);
  }

  function getInput(type, path, data, def){
    const val = def || getIn(data, path);
    return <Input type={type} handleChange={handleChange.bind(this, path)} val={val} />;
  };


  const bonusConsequences = (template.consequences.skills.reduce((maxLevel, skill)=>(
    Math.max( maxLevel, sheet.skills[skill] || 0 )
  ), 0 ) >= template.consequences.bonusSkillLevel)*1;

  const maxConsequences = template.consequences.defaultCount + bonusConsequences;

  const totalSkillLevels = Object.keys(skills).reduce( (result, skill)=>( result += skills[skill] ), 0 )
  const skillsPerLevel = Object.keys(sheet.skills).reduce( (skillsPerLevel, skill) => {
    const skillLevel = sheet.skills[skill];
    skillsPerLevel[skillLevel] = (skillsPerLevel[skillLevel] || []).concat([skill]);
    return skillsPerLevel;
  }, {});
  const skillOptions = [{
    label: '-',
    value: null
  }].concat( template.skillList.map( (skill) => ({
    label: text[skill],
    value: skill
  })));
  const skillBlock = totalSkillLevels > 0 ? <div className="SheetEditor-skills" >
    { template.skillLevels.map( (levelName, index) => {
      const level = template.skillLevels.length - index;
      const levelSkills = (skillsPerLevel[level] || []).sort( (skillA, skillB)=>(
        text[skillA] > text[skillB]
      ) );
      return <div className="row" key={ "skillLevel-"+level }>
        { levelSkills.map( (skill, index) => {
          const inputState = '';
          const currentPath = 'skills.'+skill;
          return <div className="col-xs-12 col-sm-2" key={ "skill-"+skill }>
            <Select className={inputState} options={ skillOptions } handleChange={ handleSkillChange.bind(this, level, index, levelSkills) } value={skill} ></Select>
          </div>;
        }) }
        { levelSkills.length < template.skillLevels.length ? <div className="col-xs-12 col-sm-2" key="skill-more" >
          <Select options={ skillOptions } handleChange={ handleSkillChange.bind(this, level, levelSkills.length, levelSkills) } value={null} ></Select>
        </div> : null }
      </div>;
      // TODO: promote skill
    } )}
  </div> : null;

  const nextStuntIndex = stunts && stunts.length && (stunts.length + 1) || 0;
  const stuntBlock = <div className="SheetEditor-stunts col-xs-12 col-sm-6">
    <h2>{text.stunts}</h2>
    {stunts ? stunts.map( (stunt, index)=>(
      <label className="input-wrap" key={"stunt-"+index} >{getInput("text", "stunts."+index, sheet)}</label>
    ) ) : null}
    <label className="input-wrap" key={"stunt-"+nextStuntIndex} >{getInput("text", "stunts."+nextStuntIndex, sheet)}</label>
  </div>;

  const nextExtrasIndex = extras && extras.length && (extras.length + 1) || 0;
  const extrasBlock = <div className="SheetEditor-extras col-xs-12 col-sm-6">
    <h2>{text.extras}</h2>
    {extras ? extras.map( (stunt, index)=>(
      <label className="input-wrap" key={"extra-"+index} >{getInput("text", "extras."+index, sheet)}</label>
    ) ) : null}
    <label className="input-wrap" key={"extra-"+nextExtrasIndex} >{getInput("text", "extras."+nextExtrasIndex, sheet)}</label>
  </div>;

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
      <div className="hidden-xs col-sm-4 logo mb-sm">
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
        { skillBlock }
      </div>
    </div>
    <div className="row mb">
      {extrasBlock}
      {stuntBlock}
    </div>
    <div className="row">
      <div className="col-xs-12 col-sm-4">
        { template.stress.map( (stress, index)=>{
          let maxStress = stress.def;
          if(stress.skill in skills){
            maxStress = maxStress + (skills[stress.skill] >= 3 ? 2 : 1);
          }
          return <div className="stress-lane" key={ "stressLane-"+index } ><h2>{stress.label} <span className="note">({stress.skill})</span></h2>
            <div className="stress">
            { seq(stress.count).map( (stressBox, index)=>(
              <label className={ "checkbox" + ((index >= maxStress) ? " disabled" : "") } key={ "stress-"+index } ><span><i className="superscript">{index+1}</i></span>{getInput("checkbox", "stress."+stress.key+"."+(index+1), sheet)}<s></s></label>
            ) ) }
            </div>
          </div>
        } ) }
      </div>
      <div className="col-xs-12 col-sm-8 consequences">
        <h2>{text.consequences}</h2>
        <div>{template.consequences.list.map( (consequence, index)=>(
          <label key={consequence.key} className={"input-wrap" + (index >= maxConsequences ? " disabled" : "")}><i className="superscript" >{consequence.val}</i><span>{text[consequence.label]}</span>{getInput("text",consequence.key, sheet)}</label>
          ) )}</div>
      </div>
    </div>
  </div>);
}

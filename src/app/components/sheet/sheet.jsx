import React from 'react';

var ref;

var data = {
  //view: "editCharacter", //list
  view: "list", //list
  viewData: {
    //id: "-KQPRrTpqWgyuPwBesFq"
  },
  lastCharacterId: 1,
  characters: []
};

var config = {
  skillLevels: 5,
  skillsPerLevel: 5,
  skillList: [ "Atletika", "Zlodějství", "Konexe", "Řemeslo", "Klamání", "Pilotování", "Vcítění", "Provokace", "Boj", "Vyšetřování", "Věda", "Medicína", "Technologie", "Všímavost", "Fyzická zdatnost", "Diplomacie", "Zdroje", "Střelba", "Kradmost", "Vůle", "Artilérie" ],
  stress: [
    { label: "Fyzický stress", key: "physical", count: 4, def: 2, skill: "Fyzická zdatnost" },
    { label: "Psychický stress", key: "mental", count: 4, def: 2, skill: "Vůle" }
  ],
  consequences: {
    defaultCount: 2,
    bonusSkillLevel: 5,
    skills: ["Fyzická zdatnost", "Vůle"],
    list: [{ val: 2, label: "Mírný", key:  "consequences.minor" }, { val: 4, label: "Střední", key:  "consequences.moderate" }, { val: 6, label: "Vážný", key:  "consequences.severe" }]
  },
  //challengeLevels: [  "Average", "Fair", "Good", "Great", "Superb" ],
  challengeLevels: [  "průměrný", "slušný", "dobrý", "skvělý", "úžasný" ],
  texts: {
    clear: "-vymazat-",
    confirm: "OK",
    cancel: "zrušit",
    save: "uložit",
    edit: "upravit",
    new: "nový",
    id: "id",
    aspects: "aspekty",
    skills: "schopnosti",
    extras: "extra",
    stunts: "triky",
    characters: "postavy",
    name: "jméno",
    description: "popis",
    refresh: "obnovení",
    mainAspect: "hlavní aspekt",
    trouble: "trable",
    consequences: "následky"
    
  }
}
function seq(count){
  return Array(count).fill(null).map( (item, index)=>( index ) );
}

var Input = React.createClass({
  getInitialState: function() {
    return {text: this.props.val || data.text || ''};
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

function editCharacter(e){
  const id = this;
  console.log("editCharacter", id);
  update({
    ...data,
    view: "editCharacter",
    viewData: { id }
  })
};

function deleteCharacter(e){
  const id = this;
  console.log("deleteCharacter", id);
  ref.child(id).remove();
};

function addCharacter(data, character){
  return {
    ...data,
    characters: [
      ...data.characters,
      {
        ...character
      }
    ]
  }
};

function removeCharacter(data, id){
  let index = data.characters.findIndex( (item)=>(
    item.id === id
  ) );
  return {
    ...data,
    characters: [
      ...data.characters.slice(0, index),
      ...data.characters.slice(index+1)
    ]
  }
};

function replaceCharacter(data, character){
  let index = data.characters.findIndex( (item)=>(
    item.id === character.id
  ) );
  return {
    ...data,
    characters: [
      ...data.characters.slice(0, index),
      character,
      ...data.characters.slice(index+1)
    ]
  }
};

function updateCharacter(data, character, id){
  let index = data.characters.findIndex( (item)=>(
    item.id === id
  ) );
  return {
    ...data,
    characters: [
      ...data.characters.slice(0, index-1),
      {
        ...character
      },
      ...data.characters.slice(index+1),
    ]
  }
};

function saveCharacter(){
  console.log("saveCharacter", data.viewData.id);
  const character = { ...collectData( document.querySelector(".editView .cs") ), id: data.viewData.id || -1 };
  console.log("saveCharacter", character);
  // handle update 
  let doUpdate = (data.viewData.id !== undefined);
  update({
    ...data,
    view: "list",
    viewData: {}
  });
  console.log("doUpdate", doUpdate, character.id, character);
  if( doUpdate ){
    ref.child(character.id).set(character);
  } else {
    ref.push(character);
  }
};

function cancelCharacterEdit(){
  console.log("cancelCharacterEdit");
  update({
    ...data,
    view: "list"
  })
};

function fillSkill(){
  let { level, column, skill, character } = this;
  console.log("fillSkill", level, column, skill, !!character );
  let unsaved = Immutable.fromJS(data.viewData.unsaved || character).setIn(['skills', level, column], skill).toJS();
  update({
    ...data,
    viewData: {
      id: character.id,
      unsaved: unsaved
    }
  });
}


const inputTemplates = {
  text: (path, val, handleChange)=>( <Input type="text" key={path} data-model={path} val={val} handleChange={handleChange} /> ),
  textarea: (path, val, handleChange)=>( <textarea data-model={path} key={path} defaultValue={val} handleChange={handleChange} ></textarea> ),
  checkbox: (path, val, handleChange)=>( <input type="checkbox" key={path} data-model={path} defaultChecked={ !!val } handleChange={handleChange} /> )
}

function getIn(obj, path){
  return path.split(".").reduce( (ref, key)=>(
    typeof ref === "object" && key in ref ? ref[key] : undefined
  ), obj);
}

function getInput(type, path, data, def, handleChange){
  def = def || type === "checkbox" ? false : "";
  let val = getIn(data, path) || def;
  return inputTemplates[type](path, val, handleChange);
}

function addToObject(data, path, val){
  let ref = data;
  path.split(".").forEach( (key, index, arr) => {
    if(index + 1 == arr.length){
      ref[key] = val;
    } else {
      ref[key] = ref[key] || {};
      ref = ref[key];
    }
  });
  return data;
}

function getSkillLevels(character){
  let skills = Immutable.Map();
  character.skills && Immutable.fromJS(character.skills).toArray().forEach( (level, levelIndex)=>(
    level.toArray().forEach( (skill)=>(
      !!skill && (skills = skills.set(skill, levelIndex+1))
    ) )
  ) );
  return skills.toJS();
}

function collectData(el){
  var model = {};
  el.querySelectorAll("[data-model]").forEach( (el)=>{
    let val = el.getAttribute("type") === "checkbox" ? el.checked : el.value;
    let path = el.getAttribute("data-model");
    model = addToObject(model, path, val);
  } );
  console.log("collectData", model);
  return model;
}

function getUnsavedCharacterInput(type, path, dataItem, def){
  return getInput(type, path, dataItem, def, (newVal)=>{
    let character = data.viewData.id !== undefined && data.characters.find( (item) => ( item.id === data.viewData.id ) ) || {};
    return update({
      ...data,
      viewData: {
        ...data.viewData,
        unsaved: Immutable.fromJS(data.viewData.unsaved || character).setIn(path.split("."), newVal).toJS()
      }
    })
  });
};

function closeModal(){
  update({
    ...data,
    viewData: {
      ...data.viewData,
      modal: undefined
    }
  });
}

function displayDeleteCharacterConfirmation(id, data){
  let character = data.characters.find( (item) => ( item.id === id ) ) || {};
  update({
    ...data,
    viewData: {
      ...data.viewData,
      modal: {
        cls: "modal-danger",
        type: "confirm",
        text: "Opravdu si přejete smazat charakter " + character.name + "?",
        confirm: ()=>{
          closeModal();
          deleteCharacter.bind(character.id)();
        },
        cancel: closeModal
      }
    }
  });
}

const views = {
  modal: (modalData) => {
    return <div className={ "modal " + (modalData.type ? "modal-" + modalData.type : "" ) + " " + (modalData.cls || "") } >
      <div className="modal-content" >
        <div className="modal-body" >{modalData.text}</div>
        <div className="modal-controls" >
          { modalData.cancel && <button onClick={modalData.cancel} className="btn modal-cancel">{config.texts.cancel}</button> || null }
          { modalData.confirm && <button onClick={modalData.confirm} className="btn btn-primary modal-confirm" >{config.texts.confirm}</button> || null } 
        </div>
      </div>
    </div>
  },
  list: (data) => {
    let modal = !data.viewData.modal ? undefined : views["modal"](data.viewData.modal);
    return <div className="list" >
      { modal }
      <h2>{config.texts.characters}</h2>
      <div className="character-list" >
        { data.characters.map( (item)=>( <div className="list-item" ><div className="item-title" >{item.name}</div><div className="actions" ><button className="edit btn" onClick={ editCharacter.bind(item.id) } >{config.texts.edit}</button> <button className="delete btn btn-danger" onClick={ displayDeleteCharacterConfirmation.bind(this, item.id, data) } >x</button></div></div> ) ) }
      </div>
      <p><button onClick={editCharacter} className="btn btn-primary">+ {config.texts.new}</button></p>
    </div>
  }, editCharacter: (data) => {
    let character = data.viewData.id !== undefined && data.characters.find( (item) => ( item.id === data.viewData.id ) ) || {};
    character = Immutable.fromJS(character).mergeDeep( data.viewData.unsaved ).toJS();
    console.log("character", character);
    let skills = getSkillLevels(character);
    let maxConsequences = config.consequences.defaultCount;
    if( config.consequences.skills.reduce( (maxLevel, skill)=>( Math.max( maxLevel, skills[skill] || 0 ) ), 0 ) >= config.consequences.bonusSkillLevel ){
      maxConsequences += 1;
    }
    return <div className="editView" >
      <div className="cs">
        <div className="row mb-sm">
          <div className="col-xs-12 col-sm-8">
            <div className="row mb-sm">
              <div className="col-xs-12 col-sm-12"><h2>{config.texts.id}</h2></div>
              <div className="col-xs-12 col-sm-9 name-column">
                <label className="input-wrap name mb-sm"><span>{config.texts.name}</span>{getUnsavedCharacterInput("text", "name", character)}</label>
                <div className="description mb-sm" ><label className="textarea-wrap"><span>{config.texts.description}</span>{getUnsavedCharacterInput("textarea", "description", character)}</label></div>
              </div>
              <div className="col-xs-12 col-sm-3 refresh mb-sm">
                <label className="textarea-wrap"><span>{config.texts.refresh}</span>{getUnsavedCharacterInput("textarea", "refresh", character)}</label>
              </div>

            </div>    
          </div>
          <div className="col-xs-12 col-sm-4 logo mb-sm">
            <img src="http://3.bp.blogspot.com/-bJjDZ-FtpHQ/ULRW6uKF3JI/AAAAAAAAAh8/PRrdYkH2fi8/s1600/Fate%2BCore%2BCover.png" alt="FATE core system" />
          </div>

        </div>
        <div className="row mb">
          <div className="col-xs-12 col-sm-5 aspects">
            <h2>{config.texts.aspects}</h2>
            <label className="input-wrap"><span>{config.texts.mainAspect}</span>{getUnsavedCharacterInput("text", "aspects.main", character)}</label>
            <label className="input-wrap"><span>{config.texts.trouble}</span>{getUnsavedCharacterInput("text", "aspects.trouble", character)}</label>
            <label className="input-wrap">{getUnsavedCharacterInput("text", "aspects.3", character)}</label>
            <label className="input-wrap">{getUnsavedCharacterInput("text", "aspects.4", character)}</label>
            <label className="input-wrap">{getUnsavedCharacterInput("text", "aspects.5", character)}</label>
          </div>
          <div className="col-xs-12 col-sm-7 skills">
            <h2>{config.texts.skills}</h2>
            { seq(config.skillLevels).reverse().map( (level) =>{
              return <div className="row">
                <div className="col-xs-12 col-sm-2">{config.challengeLevels[level]}&nbsp;(+{level+1})</div>
                { seq(config.skillsPerLevel).map( (column)=>{
                  let currentPath = "skills.level"+(level+1)+".column"+(column+1);
                  let val = getIn(character, currentPath);
                  let inputState = "skill-valid";
                  let title;
                  if( level !== 0 ){
                    let lowerSkillCount = Immutable.fromJS( getIn(character,  "skills.level"+(level) ) || {} ).toArray().filter( (val)=>( !!val ) ).length;
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
                  return <div className="col-xs-12 col-sm-2"><label className={"input-wrap " + inputState} title={title} >{getUnsavedCharacterInput("text", currentPath, character)}<div className="skill-list" > {[config.texts.clear].concat(config.skillList).map( (skill)=>( <button onClick={ fillSkill.bind({ level: "level"+(level+1), column: "column"+(column+1), skill: (skill === config.texts.clearText ? "" : skill), character}) } >{skill}</button> ) )}</div></label></div>
                } ) }
              </div> } ) }
          </div>
        </div>
        <div className="row mb">
          <div className="col-xs-12 col-sm-6">
            <h2>{config.texts.extras}</h2>
            <div className="extras" >{getUnsavedCharacterInput("textarea", "extras", character)}</div>
          </div>
          <div className="col-xs-12 col-sm-6">
            <h2>{config.texts.stunts}</h2>
            <div className="stunts" >{getUnsavedCharacterInput("textarea", "stunts", character)}</div>
          </div>
        </div>
        <div className="row">
          <div className="col-xs-12 col-sm-4">
            { config.stress.map( (stress)=>{
              let maxStress = stress.def;
              if(stress.skill in skills){
                maxStress = maxStress + (skills[stress.skill] >= 3 ? 2 : 1);
              }
              return <div className="stress-lane" ><h2>{stress.label} <span className="note">({stress.skill})</span></h2>
                <div className="stress">
                { seq(stress.count).map( (stressBox, index)=>(
                  <label className={ "checkbox" + ((index >= maxStress) ? " disabled" : "") } ><span><i className="superscript">{index+1}</i></span>{getUnsavedCharacterInput("checkbox", "stress."+stress.key+"."+(index+1), character)}<s></s></label>
                ) ) }
                </div>
              </div>
            } ) }
          </div>
          <div className="col-xs-12 col-sm-8 consequences">
            <h2>{config.texts.consequences}</h2>
            <div>{config.consequences.list.map( (consequence, index)=>(
              <label key={consequence.key} className={"input-wrap" + (index >= maxConsequences ? " disabled" : "")}><i className="superscript" >{consequence.val}</i><span>{consequence.label}</span>{getUnsavedCharacterInput("text",consequence.key, character)}</label>
              ) )}</div>
          </div>
        </div>
      </div>
      <div className="character-edit-controls" ><hr /><button onClick={cancelCharacterEdit} className="btn" >{config.texts.cancel}</button><button onClick={saveCharacter} className="btn btn-success" >{config.texts.save}</button></div>
    </div>;
  }
}

class Sheet extends Component {

  constructor(props) {
    super(props);
  }

  render() {
    return (
      let character = data.viewData.id !== undefined && data.characters.find( (item) => ( item.id === data.viewData.id ) ) || {};
      character = Immutable.fromJS(character).mergeDeep( data.viewData.unsaved ).toJS();
      console.log("character", character);
      let skills = getSkillLevels(character);
      let maxConsequences = config.consequences.defaultCount;
      if( config.consequences.skills.reduce( (maxLevel, skill)=>( Math.max( maxLevel, skills[skill] || 0 ) ), 0 ) >= config.consequences.bonusSkillLevel ){
        maxConsequences += 1;
      }
      return <div className="editView" >
        <div className="cs">
          <div className="row mb-sm">
            <div className="col-xs-12 col-sm-8">
              <div className="row mb-sm">
                <div className="col-xs-12 col-sm-12"><h2>{config.texts.id}</h2></div>
                <div className="col-xs-12 col-sm-9 name-column">
                  <label className="input-wrap name mb-sm"><span>{config.texts.name}</span>{getUnsavedCharacterInput("text", "name", character)}</label>
                  <div className="description mb-sm" ><label className="textarea-wrap"><span>{config.texts.description}</span>{getUnsavedCharacterInput("textarea", "description", character)}</label></div>
                </div>
                <div className="col-xs-12 col-sm-3 refresh mb-sm">
                  <label className="textarea-wrap"><span>{config.texts.refresh}</span>{getUnsavedCharacterInput("textarea", "refresh", character)}</label>
                </div>

              </div>    
            </div>
            <div className="col-xs-12 col-sm-4 logo mb-sm">
              <img src="http://3.bp.blogspot.com/-bJjDZ-FtpHQ/ULRW6uKF3JI/AAAAAAAAAh8/PRrdYkH2fi8/s1600/Fate%2BCore%2BCover.png" alt="FATE core system" />
            </div>

          </div>
          <div className="row mb">
            <div className="col-xs-12 col-sm-5 aspects">
              <h2>{config.texts.aspects}</h2>
              <label className="input-wrap"><span>{config.texts.mainAspect}</span>{getUnsavedCharacterInput("text", "aspects.main", character)}</label>
              <label className="input-wrap"><span>{config.texts.trouble}</span>{getUnsavedCharacterInput("text", "aspects.trouble", character)}</label>
              <label className="input-wrap">{getUnsavedCharacterInput("text", "aspects.3", character)}</label>
              <label className="input-wrap">{getUnsavedCharacterInput("text", "aspects.4", character)}</label>
              <label className="input-wrap">{getUnsavedCharacterInput("text", "aspects.5", character)}</label>
            </div>
            <div className="col-xs-12 col-sm-7 skills">
              <h2>{config.texts.skills}</h2>
              { seq(config.skillLevels).reverse().map( (level) =>{
                return <div className="row">
                  <div className="col-xs-12 col-sm-2">{config.challengeLevels[level]}&nbsp;(+{level+1})</div>
                  { seq(config.skillsPerLevel).map( (column)=>{
                    let currentPath = "skills.level"+(level+1)+".column"+(column+1);
                    let val = getIn(character, currentPath);
                    let inputState = "skill-valid";
                    let title;
                    if( level !== 0 ){
                      let lowerSkillCount = Immutable.fromJS( getIn(character,  "skills.level"+(level) ) || {} ).toArray().filter( (val)=>( !!val ) ).length;
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
                    return <div className="col-xs-12 col-sm-2"><label className={"input-wrap " + inputState} title={title} >{getUnsavedCharacterInput("text", currentPath, character)}<div className="skill-list" > {[config.texts.clear].concat(config.skillList).map( (skill)=>( <button onClick={ fillSkill.bind({ level: "level"+(level+1), column: "column"+(column+1), skill: (skill === config.texts.clearText ? "" : skill), character}) } >{skill}</button> ) )}</div></label></div>
                  } ) }
                </div> } ) }
            </div>
          </div>
          <div className="row mb">
            <div className="col-xs-12 col-sm-6">
              <h2>{config.texts.extras}</h2>
              <div className="extras" >{getUnsavedCharacterInput("textarea", "extras", character)}</div>
            </div>
            <div className="col-xs-12 col-sm-6">
              <h2>{config.texts.stunts}</h2>
              <div className="stunts" >{getUnsavedCharacterInput("textarea", "stunts", character)}</div>
            </div>
          </div>
          <div className="row">
            <div className="col-xs-12 col-sm-4">
              { config.stress.map( (stress)=>{
                let maxStress = stress.def;
                if(stress.skill in skills){
                  maxStress = maxStress + (skills[stress.skill] >= 3 ? 2 : 1);
                }
                return <div className="stress-lane" ><h2>{stress.label} <span className="note">({stress.skill})</span></h2>
                  <div className="stress">
                  { seq(stress.count).map( (stressBox, index)=>(
                    <label className={ "checkbox" + ((index >= maxStress) ? " disabled" : "") } ><span><i className="superscript">{index+1}</i></span>{getUnsavedCharacterInput("checkbox", "stress."+stress.key+"."+(index+1), character)}<s></s></label>
                  ) ) }
                  </div>
                </div>
              } ) }
            </div>
            <div className="col-xs-12 col-sm-8 consequences">
              <h2>{config.texts.consequences}</h2>
              <div>{config.consequences.list.map( (consequence, index)=>(
                <label key={consequence.key} className={"input-wrap" + (index >= maxConsequences ? " disabled" : "")}><i className="superscript" >{consequence.val}</i><span>{consequence.label}</span>{getUnsavedCharacterInput("text",consequence.key, character)}</label>
                ) )}</div>
            </div>
          </div>
        </div>
        <div className="character-edit-controls" ><hr /><button onClick={cancelCharacterEdit} className="btn" >{config.texts.cancel}</button><button onClick={saveCharacter} className="btn btn-success" >{config.texts.save}</button></div>
      </div>;
    );
  }
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators({  }, dispatch);
}


function mapStateToProps(state) {
  return {
    sheets: state.sheets
  };
}


export default connect(mapStateToProps, mapDispatchToProps)(Sheet);

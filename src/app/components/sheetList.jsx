import React, { Component } from 'react';
import { Link } from 'react-router';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { fetchUser } from '../actions/firebase_actions';
import { syncSheets } from '../actions/sheet';
import { capitalizeFirstLetter as capFirst } from '../utils/text';

class SheetList extends Component {

  componentWillMount() {
    this.props.fetchUser().then(
      this.props.syncSheets
    )
  }

  render() {
    console.log("SheetList props", this.props);
    let modal = this.props.modalState.isVisible ? "display modal" : null;
    let text = this.props.dictionary;
    const sheets = this.props.sheetListState.sheets;
    return <div>
      { modal }
      <h1>Sheets ({this.props.sheetListState.sheets.length})</h1>

      <div className="SheetList" >
        <h2>{capFirst(text.characters)}</h2>
        <div className="SheetList-list" >
          { sheets.map( (item)=>( <div className="SheetList-item" key={item.key} >
            <div className="SheetList-item-title" >{item.name}</div>
            <div className="SheetList-item-actions" >
              <button className="edit button" onClick={ editCharacter.bind(this, item.id) } >{text.edit}</button>
              <button className="delete button button-danger" onClick={ displayDeleteCharacterConfirmation.bind(this, item.id) } >&times;</button>
            </div>
          </div> ) ) }
        </div>
        <p><button onClick={newCharacter} className="button button-primary">+ {text.new}</button></p>
      </div>

    </div>;
  }
}

function displayDeleteCharacterConfirmation(id){
  console.log("displayDeleteCharacterConfirmation", id);
}

function editCharacter(id){
  console.log("editCharacter", id);
}

function newCharacter(){
  console.log("newCharacter");
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators({ syncSheets: syncSheets.bind(this, dispatch), fetchUser }, dispatch);
}


function mapStateToProps(state) {
  console.log("mapStateToProps", state);
  return {
    sheetListState: state.sheetList,
    dictionary: state.dictionary[state.config.language],
    modalState: state.modal
  };
}


export default connect(mapStateToProps, mapDispatchToProps)(SheetList);

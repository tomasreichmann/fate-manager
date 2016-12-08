import React, { Component } from 'react';
import { Link } from 'react-router';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { fetchUser } from '../actions/firebase_actions';
import { syncSheets, editSheet, cancelUpdates, saveUpdates, handleChange } from '../actions/sheet';
import { capitalizeFirstLetter as capFirst } from '../utils/utils';
import SheetEditor from './SheetEditor';
import Loading from './Loading';

class SheetEditView extends Component {

  constructor(props) {
    super(props);
    this.sheetKey = this.props.params.sheetKey;
  }

  componentWillMount() {
    this.props.fetchUser().then( ()=>{
      console.log("componentWillMount sheet", this.props.sheet);
      return this.props.editSheet(this.sheetKey);
    } );
  }

  render() {
    const text = this.props.dictionary;
    const sheet = this.props.sheet;
    const template = this.props.template;

    console.log("render unsaved sheet", sheet);

    const sheetEditorBlock = sheet ? (
      <SheetEditor {...sheet} dictionary={this.props.dictionary} template={template} handleChange={this.handleChange.bind(this, this.sheetKey)} ></SheetEditor>
    ) : null;

    return <div className="SheetEditView" >
      { this.modal }
      <Loading show={!sheet} >Loading...</Loading>
      { sheetEditorBlock }
      <hr />
      { sheet ? <div className="SheetEditView-buttons">
        <button key="button-cancel" className="button button-danger" onClick={this.cancel.bind(this, this.sheetKey)} >{ capFirst(text.dropUpdates) }</button>
        <Link key="button-warning" className="button button-warning" to="/" >{ capFirst(text.leaveWithoutSaving) }</Link>
        <button key="button-save" className="button button-primary" onClick={this.save.bind(this, sheet)} >{ capFirst(text.save) }</button>
      </div> : null }
    </div>;
  }

  cancel(sheetKey){
    console.log("cancel", sheetKey);
    this.props.cancelUpdates(sheetKey);
    this.context.router.push('/');
  }

  save(sheet){
    console.log("save", sheet);
    this.props.saveUpdates(sheet);
    this.context.router.push('/block/'+sheet.key);
  }

  handleChange(key, path, value){
    console.log("handleChange", arguments);
    this.props.handleChange(key, path, value)
  }
}

SheetEditView.contextTypes = {
  router: React.PropTypes.object.isRequired
};

function mapDispatchToProps(dispatch) {
  return bindActionCreators({
    syncSheets: syncSheets.bind(this, dispatch),
    editSheet: editSheet.bind(this, dispatch),
    saveUpdates: saveUpdates.bind(this, dispatch),
    cancelUpdates,
    handleChange,
    fetchUser
  }, dispatch);
}

function mapStateToProps(state, ownProps) {
  const sheetKey = ownProps.params.sheetKey;
  const sheet = state.sheetEdit.unsaved[sheetKey];
  const conflictedSheet = state.sheetEdit.conflicted[sheetKey];
  console.log("mapStateToProps sheet", sheet);
  return {
    sheet,
    template: sheet ? state.template.map[sheet.template] : null,
    sheetListState: state.sheetList,
    sheetEditState: state.sheetEdit,
    dictionary: state.dictionary[state.config.language],
    templates: state.template.map,
    modalState: state.modal,
    modal: state.modal.isVisible ? "display modal" : null // TODO
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(SheetEditView);

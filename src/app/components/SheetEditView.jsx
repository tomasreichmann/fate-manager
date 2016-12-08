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
      return this.props.editSheet(this.sheetKey, this.sheet);
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
        <button key="button-cancel" className="btn btn-danger" onClick={this.cancel.bind(this, this.sheetKey)} >{ capFirst(text.cancel) }</button>
        <button key="button-save" className="btn btn-primary" onClick={this.save.bind(this, this.sheetKey)} >{ capFirst(text.save) }</button>
      </div> : null }
    </div>;
  }

  cancel(sheetKey){
    console.log("cancel", sheetKey);
    this.props.cancelUpdates(sheetKey);
    this.context.router.push('/');
  }

  save(sheetKey){
    console.log("save", sheetKey);
    this.props.saveUpdates(sheetKey);
    this.context.router.push('/block/'+sheetKey);
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
    editSheet: editSheet.bind(this, dispatch ),
    cancelUpdates: cancelUpdates.bind(this, dispatch),
    saveUpdates: saveUpdates.bind(this, dispatch),
    handleChange,
    fetchUser
  }, dispatch);
}

function mapStateToProps(state, ownProps) {
  const sheet = state.sheetEdit.unsaved[ownProps.params.sheetKey];
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

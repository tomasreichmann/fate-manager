import React, { Component } from 'react';
import { Link } from 'react-router';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { fetchUser } from '../actions/firebase_actions';
import { syncSheets, editSheet } from '../actions/sheet';
import { capitalizeFirstLetter as capFirst } from '../utils/utils';
import SheetEditor from './SheetEditor';
import Loading from './Loading';

class SheetEditView extends Component {

  componentWillMount() {
    // TODO: get id from path
    const sheetKey = this.props.params.sheetKey;
    this.props.fetchUser().then( ()=>{
      this.props.editSheet(sheetKey);
    } );
  }

  render() {
    const sheets = this.props.sheetListState.sheets;
    const sheetKey = this.props.params.sheetKey;
    const sheet = this.props.sheetDetailState.sheet;
    const template = sheet ? this.props.templates[sheet.template] : null;
    console.log("SheetEditView", sheetKey, 'props', this.props);
    console.log("SheetEditView sheet", sheet);
    console.log("SheetEditView template", template);
    let modal = this.props.modalState.isVisible ? "display modal" : null;
    let text = this.props.dictionary;

    const sheetDetail = sheet ? (<div className="SheetDetail" >
      <SheetEditor {...sheet} dictionary={this.props.dictionary} template={template}></SheetEditor>
    </div>) : null;

    return <div>
      { modal }

      { sheetDetail }
      <Loading show={!sheet} >Loading...</Loading>
      <hr />
      { sheet ? <Link className="btn btn-primary" to={"/block/" + sheet.key}>{ capFirst(text.viewAsBlock) }</Link> : null }
    </div>;
  }
}

SheetEditView.contextTypes = {
  router: React.PropTypes.object.isRequired
};

function mapDispatchToProps(dispatch) {
  return bindActionCreators({
    syncSheets: syncSheets.bind(this, dispatch),
    editSheet: editSheet.bind(this, dispatch),
    fetchUser
  }, dispatch);
}

function mapStateToProps(state) {
  return {
    sheetListState: state.sheetList,
    sheetDetailState: state.sheetDetail,
    dictionary: state.dictionary[state.config.language],
    templates: state.template.map,
    modalState: state.modal
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(SheetEditView);

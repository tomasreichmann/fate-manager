import React, { Component } from 'react';
import { Link } from 'react-router';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { fetchUser } from '../actions/firebase_actions';
import { editSheet } from '../actions/sheet';
import { capitalizeFirstLetter as capFirst } from '../utils/utils';
import SheetBlock from './SheetBlock';
import Loading from './Loading';

class SheetBlockView extends Component {

  constructor(props) {
    super(props);
    this.state = {loading: true};
  }

  componentWillMount() {
    const sheetKey = this.props.params.sheetKey;
    this.props.fetchUser().then( ()=>{
      this.props.editSheet(sheetKey);
    } );
  }

  render() {
    const sheets = this.props.sheetListState.sheets;
    const sheetKey = this.props.params.sheetKey;
    const sheet = this.props.sheetEditState.unsaved[sheetKey];
    const template = sheet ? this.props.templates[sheet.template] : null;
    const modal = this.props.modalState.isVisible ? "display modal" : null;
    const text = this.props.dictionary;

    const sheetBlock = sheet ? (
      <SheetBlock {...sheet} dictionary={this.props.dictionary} template={template}></SheetBlock>
    ) : null;

    return <div className="SheetBlockView" >
      { modal }
      <Loading show={!sheet} >Loading...</Loading>
      { sheetBlock }
      <hr />
      { sheet ? <Link className="button button-primary" to={"/edit/" + sheet.key}>{ capFirst(text.edit) }</Link> : null }
    </div>;
  }
}

SheetBlockView.contextTypes = {
  router: React.PropTypes.object.isRequired
};


function mapDispatchToProps(dispatch) {
  return bindActionCreators({
    editSheet: editSheet.bind(this, dispatch),
    fetchUser
  }, dispatch);
}

function mapStateToProps(state) {
  return {
    sheetListState: state.sheetList,
    sheetEditState: state.sheetEdit,
    dictionary: state.dictionary[state.config.language],
    templates: state.template.map,
    modalState: state.modal
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(SheetBlockView);

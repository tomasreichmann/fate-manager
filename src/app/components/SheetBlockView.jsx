import React, { Component } from 'react';
import { Link } from 'react-router';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { fetchUser } from '../actions/firebase_actions';
import { displayBlock, updateSheet } from '../actions/sheet';
import { capitalizeFirstLetter as capFirst } from '../utils/utils';
import SheetBlock from './SheetBlock';
import Loading from './Loading';

class SheetBlockView extends Component {

  constructor(props) {
    super(props);
    this.state = {loading: true};
    this.sheetKey = props.params.sheetKey;
    this.handleChange = handleChange.bind(this);
  }

  componentWillMount() {
    const sheetKey = this.props.params.sheetKey;
    this.props.fetchUser().then( ()=>{
      this.props.displayBlock(sheetKey);
    } );
  }

  render() {
    const sheetKey = this.sheetKey;
    const sheet = this.props.sheetBlockState.sheets[sheetKey];
    const template = sheet ? this.props.templates[sheet.template] : null;
    const modal = this.props.modalState.isVisible ? "display modal" : null;
    const text = this.props.dictionary;

    const sheetBlock = sheet ? (
      <SheetBlock {...sheet} dictionary={this.props.dictionary} template={template} handleChange={this.handleChange.bind(this, sheet)} ></SheetBlock>
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

function handleChange (sheet, path, value){
  console.log("SheetBlockView handleChange", "path", path, "value", value);
  this.props.updateSheet(sheet, path, value);
};


function mapDispatchToProps(dispatch) {
  return bindActionCreators({
    displayBlock: displayBlock.bind(this, dispatch),
    updateSheet: updateSheet.bind(this, dispatch),
    fetchUser
  }, dispatch);
}

function mapStateToProps(state) {
  return {
    sheetListState: state.sheetList,
    sheetBlockState: state.sheetBlock,
    dictionary: state.dictionary[state.config.language],
    templates: state.template.map,
    modalState: state.modal
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(SheetBlockView);

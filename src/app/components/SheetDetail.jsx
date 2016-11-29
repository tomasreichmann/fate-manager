import React, { Component } from 'react';
import { Link } from 'react-router';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { fetchUser } from '../actions/firebase_actions';
import { syncSheets, editSheet } from '../actions/sheet';
import { capitalizeFirstLetter as capFirst } from '../utils/text';
import SheetBlock from './SheetBlock';

class SheetDetail extends Component {

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
    console.log("SheetDetail", sheetKey, 'props', this.props);
    console.log("SheetDetail sheet", sheet);
    let modal = this.props.modalState.isVisible ? "display modal" : null;
    let text = this.props.dictionary;

    const sheetDetail = sheet ? (<div className="SheetDetail" >
      <SheetBlock {...sheet} ></SheetBlock>
    </div>) : null;

    return <div>
      { modal }
      <h1>{ sheet ? sheet.name : 'Loading...' }</h1>

      { sheetDetail }

    </div>;
  }
}

SheetDetail.contextTypes = {
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
  console.log("mapStateToProps", state);
  return {
    sheetListState: state.sheetList,
    sheetDetailState: state.sheetDetail,
    dictionary: state.dictionary[state.config.language],
    modalState: state.modal
  };
}


export default connect(mapStateToProps, mapDispatchToProps)(SheetDetail);

import React, { Component } from 'react';
import { Link } from 'react-router';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { syncSheets, sheetAdded } from '../actions/sheet';

class SheetList extends Component {

  componentWillMount() {
    this.props.syncSheets(this.props.sheetAdded);
  }

  render() {
    console.log("SheetList props", this.props);
    return <div>
      <h1>Sheets ({this.props.sheetListState.sheets.length})</h1>
      {this.props.sheetListState.sheets.map( sheet => ( sheet.val ) ).join(', ')}
    </div>;
  }
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators({ syncSheets, sheetAdded }, dispatch);
}


function mapStateToProps(state) {
  return {
    sheetListState: state.sheetList
  };
}


export default connect(mapStateToProps, mapDispatchToProps)(SheetList);

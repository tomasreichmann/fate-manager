import Immutable from 'immutable';
import * as TYPES from '../actions/types';

const initialState = {
  sync: false,
  unsaved: {},
  conflicted: {}
}

export default function (state = initialState, action) {
  switch (action.type) {
    case TYPES.SHEET_EDIT: {
      return {
        ...state,
        sync: true
      };
    }

    case TYPES.SHEET_EDIT_ON_VALUE: {
      const sheetKey = action.payload.sheet.key;
      const unsavedSheet = state.unsaved[sheetKey];
      const savedSheet = action.payload.sheet;
      const conflicted = unsavedSheet ? {
        ...state.conflicted,
        [sheetKey]: savedSheet
      } : state.conflicted;
      const unsaved = unsavedSheet ? state.unsaved : {
        ...state.unsaved,
        [sheetKey]: savedSheet
      };

      return {
        ...state,
        unsaved,
        conflicted
      };
    }

    case TYPES.SHEET_HANDLE_CHANGE: {
      const value = action.payload.value;
      const key = action.payload.key;
      const path = action.payload.path;
      const newSheet = state.unsaved[key];

      return {
        ...state,
        unsaved: {
          ...state.unsaved,
          [key]: Immutable.fromJS(newSheet).setIn(path.split("."), value).toJS()
        }
      };
    }

    case TYPES.SHEET_SAVE_UPDATES:
    case TYPES.SHEET_CANCEL_UPDATES: {
      const key = action.payload.key;
      const conflicted = { ...state.conflicted };
      const unsaved = { ...state.unsaved };
      delete unsaved[key];
      delete conflicted[key];
      return {
        ...state,
        unsaved,
        conflicted
      };
    }
  }
  return state;
}

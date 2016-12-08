import Immutable from 'immutable';
import {
  SHEET_EDIT,
  SHEET_EDIT_ON_VALUE,
  SHEET_HANDLE_CHANGE,
  SHEET_SAVE_UPDATES,
  SHEET_CANCEL_UPDATES
} from '../actions/types';

const initialState = {
  unsaved: {},
  conflicted: {}
}

export default function (state = initialState, action) {
  switch (action.type) {
    case SHEET_EDIT: {
      console.log("SHEET_EDIT");
      return state;
    }

    case SHEET_EDIT_ON_VALUE: {
      console.log(action.type, "action", action, "state", state);
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

    case SHEET_HANDLE_CHANGE: {
      console.log(action.type, "action", action, "state", state);
      const value = action.payload.value;
      const key = action.payload.key;
      const path = action.payload.path;
      const newSheet = state.unsaved[key];
      console.log("SHEET_HANDLE_CHANGE", "key", key, "path", path, "value", value);

      return {
        ...state,
        unsaved: {
          ...state.unsaved,
          [key]: Immutable.fromJS(newSheet).setIn(path.split("."), value).toJS()
        }
      };
    }

    case SHEET_SAVE_UPDATES:
    case SHEET_CANCEL_UPDATES: {
      console.log(action.type, "action", action, "state", state);
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

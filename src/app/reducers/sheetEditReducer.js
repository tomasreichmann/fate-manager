import Immutable from 'immutable';
import {
  SHEET_EDIT,
  SHEET_EDIT_ON_VALUE,
  SHEET_HANDLE_CHANGE,
} from '../actions/types';

const initialState = {
  unsaved: {}
}

export default function (state = initialState, action) {
  switch (action.type) {
    case SHEET_EDIT: {
      console.log("SHEET_EDIT");
      return state;
    }
    case SHEET_EDIT_ON_VALUE: {
      console.log("SHEET_EDIT_ON_VALUE", "action", action, "state", state);
      const sheet = action.payload.sheet;
      // TODO handle editing conflict
      return {
        ...state,
        unsaved: {
          ...state.unsaved,
          [sheet.key]: sheet
        }
      };
    }
    case SHEET_HANDLE_CHANGE: {
      console.log("SHEET_HANDLE_CHANGE", "action", action, "state", state);
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
  }
  return state;
}

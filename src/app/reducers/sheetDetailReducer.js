import {
  SHEET_EDIT,
  SHEET_EDIT_ON_VALUE,
} from '../actions/types';

const initialState = {
  sheet: null
}

export default function (state = initialState, action) {
  switch (action.type) {
    case SHEET_EDIT: {
      console.log("SHEET_EDIT");
      return state;
    }
    case SHEET_EDIT_ON_VALUE: {
      console.log("SHEET_EDIT_ON_VALUE", "action", action, "state", state);
      // TODO handle editing conflict
      return {
        ...state,
        sheet: action.payload.sheet
      };
    }
  }
  return state;
}

import {
  SHEETS_SYNC,
  SHEET_ADDED
} from '../actions/types';

const initialState = {
  sheets: [],
  test: "xxx"
}

export default function (state = initialState, action) {
  console.log(action.type, action.payload);
  switch (action.type) {
    case SHEETS_SYNC: {
      console.log("SHEETS_SYNC");
      return state;
    }
    case SHEET_ADDED: {
      console.log("SHEET_ADDED", "action", action, "state", state);
      return {
        ...state,
        sheets: [
          ...state.sheets,
          action.payload
        ]
      };
    }

  }
  return state;
}

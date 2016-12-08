import * as TYPES from '../actions/types';

const initialState = {
  sheets: {},
  sync: false
}

export default function (state = initialState, action) {
  switch (action.type) {
    case TYPES.SHEET_BLOCK_DISPLAY: {
      return {
        ...state,
        sync: true
      };
    }

    case TYPES.SHEET_BLOCK_ON_VALUE: {
      const sheet = action.payload.sheet
      return {
        ...state,
        sheets: {
          ...state.sheets,
          [sheet.key]: sheet
        }
      };
    }

  }
  return state;
}

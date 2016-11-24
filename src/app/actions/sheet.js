import FireBaseTools from '../utils/firebase';
import {
  SHEETS_SYNC,
  SHEET_ADDED
} from './types';


export function syncSheets(callback) {
  const request = FireBaseTools.subscribe('sheets', 'child_added', callback);
  console.log("syncSheets", request);
  return {
    type: SHEETS_SYNC,
    payload: request
  }
}

export function sheetAdded(sheetSnapshot) {
  console.log("sheetAdded", sheetSnapshot);
  return {
    type: SHEET_ADDED,
    payload: {
      val: sheetSnapshot.val(),
      key: sheetSnapshot.key
    }
  }
}

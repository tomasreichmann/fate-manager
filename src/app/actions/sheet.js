import FireBaseTools from '../utils/firebase';
import {
  SHEETS_SYNC,
  SHEETS_ON_VALUE,
  SHEETS_ON_CHILD_ADDED,
  SHEETS_ON_CHILD_REMOVED,
  SHEETS_ON_CHILD_CHANGED,
  SHEETS_ON_CHILD_MOVED,
  SHEET_EDIT,
  SHEET_EDIT_ON_VALUE,
} from './types';

const FIREBASE_EVENTS = {
  VALUE: 'value',
  CHILD_ADDED: 'child_added',
  CHILD_REMOVED: 'child_removed',
  CHILD_CHANGED: 'child_changed',
  CHILD_MOVED: 'child_moved'
};

export function syncSheets(dispatch, isSynced) {
  console.log("syncSheets");

  if(!isSynced){
    const ref = FireBaseTools.getDatabaseReference('sheets');
    ref.on(FIREBASE_EVENTS.CHILD_ADDED, (snapshot, previousKey) => { dispatch( sheetsOnChildAdded(snapshot, previousKey) ); } );
    ref.on(FIREBASE_EVENTS.CHILD_REMOVED, (snapshot) => { dispatch( sheetsOnChildRemoved(snapshot) ); } );
    ref.on(FIREBASE_EVENTS.CHILD_CHANGED, (snapshot) => { dispatch( sheetsOnChildChanged(snapshot) ); } );
    ref.on(FIREBASE_EVENTS.CHILD_MOVED, (snapshot, previousKey) => { dispatch( sheetsOnChildMoved(snapshot, previousKey) ) } );

    return {
      type: SHEETS_SYNC
    }
  }
  return {
    type: null
  }
}

export function sheetsOnChildAdded(snapshot, previousKey){
  console.log("sheetsOnChildAdded", snapshot, previousKey);
  return {
    type: SHEETS_ON_CHILD_ADDED,
    payload: {
      item: {
        ...(snapshot.val()),
        key: snapshot.key
      },
      previousKey
    }
  }
}
export function sheetsOnChildRemoved(snapshot){
  console.log("sheetsOnChildRemoved", snapshot);
  return {
    type: SHEETS_ON_CHILD_REMOVED,
    payload: {
      key: snapshot.key
    }
  }
}
export function sheetsOnChildChanged(snapshot){
  console.log("sheetsOnChildChanged", snapshot);
  return {
    type: SHEETS_ON_CHILD_CHANGED,
    payload: {
      val: snapshot.val(),
      key: snapshot.key
    }
  }
}
export function sheetsOnChildMoved(snapshot, previousKey){
  console.log("sheetsOnChildMoved", snapshot, previousKey);
  return {
    type: SHEETS_ON_CHILD_MOVED,
    payload: {
      item: {
        ...(snapshot.val()),
        key: snapshot.key
      },
      previousKey
    }
  }
}

export function editSheet(dispatch, sheetKey){
  console.log("editSheet");
  const ref = FireBaseTools.getDatabaseReference('sheets/'+sheetKey);
  ref.once(FIREBASE_EVENTS.VALUE, (snapshot) => { dispatch( sheetOnValue(snapshot) ); } );
  return {
    type: SHEET_EDIT
  }
}

export function sheetOnValue(snapshot){
  console.log("sheetOnValue", snapshot);
  return {
    type: SHEET_EDIT_ON_VALUE,
    payload: {
      sheet: {
        ...(snapshot.val()),
        key: snapshot.key
      }
    }
  }
}

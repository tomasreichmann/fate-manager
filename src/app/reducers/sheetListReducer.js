import {
  SHEETS_SYNC,
  SHEETS_ON_CHILD_ADDED,
  SHEETS_ON_CHILD_REMOVED,
  SHEETS_ON_CHILD_CHANGED,
  SHEETS_ON_CHILD_MOVED
} from '../actions/types';

const initialState = {
  sheets: [],
  isSynced: false
}

function addAfter(array, item, previousKey){
  const itemIndex = array.indexOf(item);
  const previousItem = previousKey !== -1 ? array.filter( (item)=>(item.key === previousKey) ) : null;
  const previousIndex = previousKey !== -1 ? array.indexOf(previousItem) : 0;

  return [
    ...array.slice(0, previousIndex),
    item,
    ...array.slice(previousIndex)
  ]
}

export default function (state = initialState, action) {
  switch (action.type) {
    case SHEETS_SYNC: {
      return {
        ...state,
        isSynced: true
      };
    }
    case SHEETS_ON_CHILD_ADDED: {
      return {
        ...state,
        sheets: addAfter(state.sheets, action.payload.item, action.payload.previousKey)
      };
    }
    case SHEETS_ON_CHILD_REMOVED: {
      return {
        ...state,
        sheets: state.sheets.filter( (item)=>( item.key != action.payload.key ) )
      };
    }
    case SHEETS_ON_CHILD_CHANGED: {

      const itemIndex = state.sheets.reduce( (result, item, index)=>{
        if( result == null && item.key === action.payload.key ){
          return index;
        }
        return result
      }, null );
      return {
        ...state,
        sheets: [
          ...state.sheets.slice(0, itemIndex),
          action.payload.val,
          ...state.sheets.slice(itemIndex+1)
        ]
      };
    }
    case SHEETS_ON_CHILD_MOVED: {
      const itemIndex = state.sheets.indexOf(action.payload.key);
      const filteredArray = state.sheets.filter( (item)=>( item.key != action.payload.key ) );

      return {
        ...state,
        sheets: addAfter(filteredArray, action.payload.item, action.payload.previousKey)
      };
    }

  }
  return state;
}

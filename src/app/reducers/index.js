import { combineReducers } from 'redux';
import firebaseUserReducer from './firebaseUserReducer';
import sheetListReducer from './sheetListReducer';
import sheetEditReducer from './sheetEditReducer';
import sheetBlockReducer from './sheetBlockReducer';
import dictionaryReducer from './dictionaryReducer';
import templateReducer from './templateReducer';
import configReducer from './configReducer';
import modalReducer from './modalReducer';

const rootReducer = combineReducers({
    currentUser: firebaseUserReducer,
    sheetList: sheetListReducer,
    sheetEdit: sheetEditReducer,
    sheetBlock: sheetBlockReducer,
    dictionary: dictionaryReducer,
    template: templateReducer,
    modal: modalReducer,
    config: configReducer,
});

const logger = function(rootReducer, state, action){
  console.info(action && action.type, action && action.payload, state);
  return rootReducer.apply( this, Array.prototype.slice.call(arguments, 1) );
}

export default logger.bind(this, rootReducer);

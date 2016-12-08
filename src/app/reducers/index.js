import { combineReducers } from 'redux';
import firebaseUserReducer from './firebaseUserReducer';
import sheetListReducer from './sheetListReducer';
import sheetEditReducer from './sheetEditReducer';
import dictionaryReducer from './dictionaryReducer';
import templateReducer from './templateReducer';
import configReducer from './configReducer';
import modalReducer from './modalReducer';

const rootReducer = combineReducers({
    currentUser: firebaseUserReducer,
    sheetList: sheetListReducer,
    sheetEdit: sheetEditReducer,
    dictionary: dictionaryReducer,
    template: templateReducer,
    modal: modalReducer,
    config: configReducer,
});

export default rootReducer;

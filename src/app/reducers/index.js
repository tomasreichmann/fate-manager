import { combineReducers } from 'redux';
import firebaseUserReducer from './firebaseUserReducer';
import sheetListReducer from './sheetListReducer';
import sheetDetailReducer from './sheetDetailReducer';
import dictionaryReducer from './dictionaryReducer';
import configReducer from './configReducer';
import modalReducer from './modalReducer';

const rootReducer = combineReducers({
    currentUser: firebaseUserReducer,
    sheetList: sheetListReducer,
    sheetDetail: sheetDetailReducer,
    dictionary: dictionaryReducer,
    modal: modalReducer,
    config: configReducer,
});

export default rootReducer;

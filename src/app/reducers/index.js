import { combineReducers } from 'redux';
import FireBaseUserReducer from './firebaseUserReducer';
import SheetListReducer from './sheetListReducer';

const rootReducer = combineReducers({
    currentUser: FireBaseUserReducer,
    sheetList: SheetListReducer,
});

export default rootReducer;

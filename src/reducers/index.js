import { combineReducers } from 'redux';
import FormReducer from './formReducer';

const rootReducer = combineReducers({
  form: FormReducer,
});

export default rootReducer;

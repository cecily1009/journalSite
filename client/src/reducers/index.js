//Reducers specify how the application's state changes in response to actions sent to the store.
//Remember that actions only describe what happened, but don't describe how the application's state changes.
import { combineReducers } from 'redux';
import alert from './alert';
import auth from './auth';
import journal from './journal';
import profile from './profile';
export default combineReducers({
  alert,
  auth,
  journal,
  profile,
});

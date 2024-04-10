import { combineReducers } from '@reduxjs/toolkit';
import { reducer as formReducer } from 'redux-form';
import userReducer from '../slices/userSlice';

const reducers = combineReducers({
  form: formReducer,
  userData: userReducer
});

export default reducers;

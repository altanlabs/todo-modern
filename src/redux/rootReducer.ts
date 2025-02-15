import { combineReducers } from '@reduxjs/toolkit';
import todosReducer from './slices/tables';
import authReducer from './slices/auth';

const rootReducer = combineReducers({
  todos: todosReducer,
  auth: authReducer,
});

export type RootState = ReturnType<typeof rootReducer>;
export default rootReducer;
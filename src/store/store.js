import { combineReducers, configureStore } from "@reduxjs/toolkit";
import authSlice from "./reducers/auth";
import userSlice from "./reducers/user";
const rootReducer = combineReducers({
  auth: authSlice.reducer,
  user: userSlice.reducer,
});

const store = configureStore({
  devTools: true,
  reducer: rootReducer,
});

export default store;

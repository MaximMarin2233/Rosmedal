import { combineReducers } from "@reduxjs/toolkit";

import { reducer as mainReducer } from "./main/main.slice";

export const reducers = combineReducers({
  mainReducer,
});

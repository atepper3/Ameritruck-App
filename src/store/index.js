import { configureStore, combineReducers } from "@reduxjs/toolkit";
import truckReducer from "./reducers/truckReducer";

const rootReducer = combineReducers({
  truck: truckReducer,
});

// Configure store directly with rootReducer
export const store = configureStore({
  reducer: rootReducer,
});

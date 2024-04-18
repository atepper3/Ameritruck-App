import { configureStore } from "@reduxjs/toolkit";
import truckReducer from "./slices/truckSlice"; // Update the path as necessary
import commissionReducer from "./slices/commissionSlice"; // Update the path as necessary
import expenseReducer from "./slices/expenseSlice"; // Update the path as necessary
import listenerMiddleware from "./slices/middleware/listenerMiddleware";

const store = configureStore({
  reducer: {
    truck: truckReducer,
    commission: commissionReducer,
    expense: expenseReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(listenerMiddleware),
});

export default store;

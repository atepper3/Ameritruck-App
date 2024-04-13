import { configureStore } from "@reduxjs/toolkit";
import listenerMiddleware from "./listenerMiddleware"; // Import the listenerMiddleware
import truckReducer from "./slices/truckSlice"; // Update the path as necessary
import commissionReducer from "./slices/commissionSlice"; // Update the path as necessary
import expenseReducer from "./slices/expenseSlice"; // Update the path as necessary

const store = configureStore({
  reducer: {
    truck: truckReducer,
    commission: commissionReducer,
    expense: expenseReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().prepend(listenerMiddleware.middleware), // Add the listenerMiddleware to the middleware array
});

export default store;

import { configureStore } from "@reduxjs/toolkit";
import truckSlice from "./slices/truckSlice";

// Configure store with the truck slice reducer
export const store = configureStore({
  reducer: {
    truck: truckSlice,
  },
});

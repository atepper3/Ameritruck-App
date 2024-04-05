import { configureStore } from '@reduxjs/toolkit';
import truckReducer from './reducers/truckReducer';

const store = configureStore({
  reducer: {
    truck: truckReducer,
  },
});

export default store;

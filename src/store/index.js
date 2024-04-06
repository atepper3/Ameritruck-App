import { configureStore, combineReducers } from '@reduxjs/toolkit';
import truckReducer from './reducers/truckReducer';
import storage from 'redux-persist/lib/storage'; // defaults to localStorage for web
import { persistReducer, persistStore } from 'redux-persist';

// Persist Config
const persistConfig = {
  key: 'root',
  storage,
};

const rootReducer = combineReducers({
  truck: truckReducer,
});

const persistedReducer = persistReducer(persistConfig, rootReducer);

// Configure store with persisted reducer
export const store = configureStore({
  reducer: persistedReducer,
});

export const persistor = persistStore(store);

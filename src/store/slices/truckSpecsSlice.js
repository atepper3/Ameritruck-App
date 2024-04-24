// src/store/slices/truckSpecsSlice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import {
  doc, getDoc, updateDoc, setDoc,
} from 'firebase/firestore';
import { db } from '../../firebase'; // Ensure you have initialized Firebase elsewhere

// Async thunk for fetching truck specs
export const fetchSpecs = createAsyncThunk(
  'truckSpecs/fetchSpecs',
  async (truckId, { rejectWithValue }) => {
    try {
      const docRef = doc(db, 'trucks', truckId);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        return { truckId, specs: docSnap.data().specs || {} };
      }
      return rejectWithValue('Document does not exist');
    } catch (error) {
      return rejectWithValue(error.message);
    }
  },
);

// Async thunk for updating specs
export const updateSpecs = createAsyncThunk(
  'truckSpecs/updateSpecs',
  async ({ truckId, specs }, { rejectWithValue }) => {
    try {
      const docRef = doc(db, 'trucks', truckId);
      await updateDoc(docRef, { specs });
      return { truckId, specs };
    } catch (error) {
      return rejectWithValue(error.message);
    }
  },
);

// Async thunk for setting (adding) specs - could be used for initial creation
export const setSpecs = createAsyncThunk(
  'truckSpecs/setSpecs',
  async ({ truckId, specs }, { rejectWithValue }) => {
    try {
      const docRef = doc(db, 'trucks', truckId);
      // This completely replaces the specs field
      await setDoc(docRef, { specs }, { merge: true });
      return { truckId, specs };
    } catch (error) {
      return rejectWithValue(error.message);
    }
  },
);

const initialState = {
  specs: {},
  status: 'idle', // 'idle' | 'loading' | 'succeeded' | 'failed'
  error: null,
};

const truckSpecsSlice = createSlice({
  name: 'truckSpecs',
  initialState,
  reducers: {
    // Optional: add reducers for other synchronous actions here
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchSpecs.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchSpecs.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.specs[action.payload.truckId] = action.payload.specs;
      })
      .addCase(fetchSpecs.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
      })
      .addCase(updateSpecs.fulfilled, (state, action) => {
        state.specs[action.payload.truckId] = action.payload.specs;
      })
      .addCase(setSpecs.fulfilled, (state, action) => {
        state.specs[action.payload.truckId] = action.payload.specs;
      });
    // Note: Handle rejected cases for updateSpecs and setSpecs similarly to fetchSpecs.rejected
  },
});

export default truckSpecsSlice.reducer;

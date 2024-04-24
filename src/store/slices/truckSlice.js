import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import {
  doc,
  getDoc,
  collection,
  addDoc,
  updateDoc,
  query,
  where,
  getDocs,
  deleteDoc,
} from 'firebase/firestore';
import { db } from '../../firebase';

// Truck Async Thunks
export const fetchTruckDetails = createAsyncThunk(
  'truck/fetchTruckDetails',
  async (truckId, { rejectWithValue }) => {
    try {
      const docRef = doc(db, 'trucks', truckId);
      const docSnap = await getDoc(docRef);
      if (!docSnap.exists()) throw new Error('No such document!');
      return { ...docSnap.data().truckinfo, id: truckId };
    } catch (error) {
      return rejectWithValue(error.toString());
    }
  },
);

export const addTruck = createAsyncThunk(
  'truck/addTruck',
  async (truckData, { rejectWithValue }) => {
    try {
      const docRef = await addDoc(collection(db, 'trucks'), {
        truckinfo: truckData,
      });
      return { ...truckData, id: docRef.id };
    } catch (error) {
      return rejectWithValue(error.toString());
    }
  },
);

export const addMultipleTrucks = createAsyncThunk(
  'truck/addMultipleTrucks',
  async (truckEntries, { rejectWithValue }) => {
    try {
      const addedTrucks = [];
      for (const truckData of truckEntries) {
        const docRef = await addDoc(collection(db, 'trucks'), {
          truckinfo: truckData,
        });
        addedTrucks.push({ ...truckData, id: docRef.id });
      }
      return addedTrucks;
    } catch (error) {
      return rejectWithValue(error.toString());
    }
  },
);

export const updateTruckDetails = createAsyncThunk(
  'truck/updateTruckDetails',
  async ({ truckId, truckDetails }, { dispatch, rejectWithValue }) => {
    try {
      await updateDoc(doc(db, 'trucks', truckId), { truckinfo: truckDetails });
      dispatch(fetchTruckDetails(truckId)); // Optionally refetch truck details
    } catch (error) {
      return rejectWithValue(error.toString());
    }
  },
);

export const fetchTruckList = createAsyncThunk(
  'truck/fetchTruckList',
  async (_, { rejectWithValue }) => {
    try {
      const truckInfoQuery = query(
        collection(db, 'trucks'),
        where('truckinfo', '!=', null),
      );
      const querySnapshot = await getDocs(truckInfoQuery);
      const trucksArray = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data().truckinfo,
      }));
      return trucksArray;
    } catch (error) {
      return rejectWithValue(error.toString());
    }
  },
);

// Truck Slice
const truckInitialState = {
  truckInfo: null,
  truckList: [],
};

const truckSlice = createSlice({
  name: 'truck',
  initialState: truckInitialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchTruckDetails.fulfilled, (state, action) => {
        state.truckInfo = action.payload;
      })
      .addCase(addTruck.fulfilled, (state, action) => {
        state.truckList.push(action.payload);
      })
      .addCase(fetchTruckList.fulfilled, (state, action) => {
        state.truckList = action.payload;
      })
      .addCase(addMultipleTrucks.fulfilled, (state, action) => {
        state.truckList.push(...action.payload);
      })
      .addCase(updateTruckDetails.fulfilled, (state, action) => {
        state.truckInfo = action.payload;
      });
  },
});

export default truckSlice.reducer;

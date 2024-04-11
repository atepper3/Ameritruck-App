import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { db } from "../../firebase";
import {
  doc,
  getDocs,
  addDoc,
  deleteDoc,
  updateDoc,
  collection,
} from "firebase/firestore";

// Commissions Async Thunks
export const fetchCommissions = createAsyncThunk(
  "commission/fetchCommissions",
  async (truckId, { rejectWithValue }) => {
    try {
      const commissionsRef = collection(db, "trucks", truckId, "commissions");
      const querySnapshot = await getDocs(commissionsRef);
      const commissions = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      return commissions;
    } catch (error) {
      return rejectWithValue(error.toString());
    }
  }
);

export const addCommission = createAsyncThunk(
  "commission/addCommission",
  async ({ truckId, commissionData }, { dispatch, rejectWithValue }) => {
    try {
      const docRef = await addDoc(
        collection(db, "trucks", truckId, "commissions"),
        commissionData
      );
      dispatch(fetchCommissions(truckId)); // Optionally refresh commissions list
      return { ...commissionData, id: docRef.id }; // Return the new commission with id
    } catch (error) {
      return rejectWithValue(error.toString());
    }
  }
);

export const deleteCommission = createAsyncThunk(
  "commission/deleteCommission",
  async ({ truckId, commissionId }, { dispatch, rejectWithValue }) => {
    try {
      await deleteDoc(doc(db, "trucks", truckId, "commissions", commissionId));
      dispatch(fetchCommissions(truckId)); // Optionally refresh commissions list
    } catch (error) {
      return rejectWithValue(error.toString());
    }
  }
);

export const updateCommission = createAsyncThunk(
  "commission/updateCommission",
  async (
    { truckId, commissionId, commissionData },
    { dispatch, rejectWithValue }
  ) => {
    try {
      const commissionRef = doc(
        db,
        "trucks",
        truckId,
        "commissions",
        commissionId
      );
      await updateDoc(commissionRef, commissionData);
      dispatch(fetchCommissions(truckId)); // Optionally refresh commissions list
    } catch (error) {
      return rejectWithValue(error.toString());
    }
  }
);

// Commission Slice
const commissionInitialState = {
  commissions: [],
};

const commissionSlice = createSlice({
  name: "commission",
  initialState: commissionInitialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchCommissions.fulfilled, (state, action) => {
        state.commissions = action.payload;
      })
      .addCase(addCommission.fulfilled, (state, action) => {
        state.commissions.push(action.payload);
      })
      .addCase(deleteCommission.fulfilled, (state, action) => {
        state.commissions = state.commissions.filter(
          (commission) => commission.id !== action.meta.arg.commissionId
        );
      })
      .addCase(updateCommission.fulfilled, (state, action) => {
        const index = state.commissions.findIndex(
          (commission) => commission.id === action.meta.arg.commissionId
        );
        if (index !== -1) {
          state.commissions[index] = {
            ...state.commissions[index],
            ...action.meta.arg.commissionData,
          };
        }
      });
  },
});

export const {
  showCommissionModal,
  hideCommissionModal,
  setCurrentCommission,
  fetchComissionsFullfilled,
  addCommissionFullfilled,
  deleteCommissionFullfilled,
  updateCommissionFullfilled,
} = commissionSlice.actions;
export default commissionSlice.reducer;

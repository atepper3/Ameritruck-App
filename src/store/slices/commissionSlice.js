import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import {
  doc,
  getDocs,
  getDoc,
  addDoc,
  deleteDoc,
  updateDoc,
  collection,
} from "firebase/firestore";
import { db } from "../../firebase";

// Commissions Async Thunks
export const fetchCommissions = createAsyncThunk(
  "commission/fetchCommissions",
  async (truckId, { rejectWithValue }) => {
    try {
      const commissionsRef = collection(db, "trucks", truckId, "commissions");
      const querySnapshot = await getDocs(commissionsRef);
      const results = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      console.log("Commissions fetched:", results); // Log fetched data
      return results;
    } catch (error) {
      console.error("Error fetching commissions:", error); // Log any errors
      return rejectWithValue(error.toString());
    }
  },
);

export const fetchFinancials = createAsyncThunk(
  "commission/fetchFinancials",
  async (truckId, { rejectWithValue }) => {
    try {
      const docRef = doc(db, "trucks", truckId, "totals", "financials");
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        return docSnap.data(); // Make sure this contains totalCommissions and netProfit
      } else {
        throw new Error("No financial data found");
      }
    } catch (error) {
      return rejectWithValue(error.toString());
    }
  },
);

export const addCommission = createAsyncThunk(
  "commission/addCommission",
  async ({ truckId, commissionData }, { dispatch, rejectWithValue }) => {
    try {
      const docRef = await addDoc(
        collection(db, "trucks", truckId, "commissions"),
        commissionData,
      );
      dispatch(fetchCommissions(truckId)); // Optionally refresh commissions list
      return { ...commissionData, id: docRef.id }; // Return the new commission with id
    } catch (error) {
      return rejectWithValue(error.toString());
    }
  },
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
  },
);

export const updateCommission = createAsyncThunk(
  "commission/updateCommission",
  async (
    { truckId, commissionId, commissionData },
    { dispatch, rejectWithValue },
  ) => {
    try {
      const commissionRef = doc(
        db,
        "trucks",
        truckId,
        "commissions",
        commissionId,
      );
      await updateDoc(commissionRef, commissionData);
      dispatch(fetchCommissions(truckId)); // Optionally refresh commissions list
    } catch (error) {
      return rejectWithValue(error.toString());
    }
  },
);

const initialState = {
  commissions: [], // List of all commissions
  currentCommission: null, // Store the current commission being edited or viewed
  showModal: false, // Control visibility of a modal or similar component
  financials: {
    totalCommissions: 0, // Total commissions for the truck
    netProfit: 0, // Net profit after commissions
  }, // Store financial data like totalCommissions and netProfit
};

const commissionSlice = createSlice({
  name: "commission",
  initialState, // Initial state defined above,
  reducers: {
    showCommissionModal(state) {
      state.showModal = true;
    },
    hideCommissionModal(state) {
      state.showModal = false;
    },
    setCurrentCommission(state, action) {
      state.currentCommission = action.payload;
    },
  },

  extraReducers: (builder) => {
    builder
      .addCase(fetchFinancials.fulfilled, (state, action) => {
        state.financials.totalCommissions = action.payload.totalCommissions;
        state.financials.netProfit = action.payload.netProfit;
      })
      .addCase(fetchCommissions.fulfilled, (state, action) => {
        state.commissions = action.payload;
        // Do not trigger calculateCommissions here
      })
      .addCase(addCommission.fulfilled, (state, action) => {
        state.commissions.push(action.payload);
        // Do not trigger calculateCommissions here
      })
      .addCase(deleteCommission.fulfilled, (state, action) => {
        state.commissions = state.commissions.filter(
          (commission) => commission.id !== action.meta.arg.commissionId,
        );
        // Do not trigger calculateCommissions here
      })
      .addCase(updateCommission.fulfilled, (state, action) => {
        const index = state.commissions.findIndex(
          (commission) => commission.id === action.meta.arg.commissionId,
        );
        if (index !== -1) {
          state.commissions[index] = {
            ...state.commissions[index],
            ...action.meta.arg.commissionData,
          };
        }
        // Do not trigger calculateCommissions here
      });
  },
});

export const {
  showCommissionModal,
  hideCommissionModal,
  setCurrentCommission,
} = commissionSlice.actions;

export default commissionSlice.reducer;

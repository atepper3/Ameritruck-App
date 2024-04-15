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
import {
  calculateGrossProfit,
  calculateTotalFlatCommissions,
  calculatePercentageCommissions,
  sumCommissionsByCategory,
  calculateNetProfit,
} from "../../services/truckCalculations";

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

const initialState = {
  commissions: [], // List of all commissions
  currentCommission: null, // Store the current commission being edited or viewed
  showModal: false, // Control visibility of a modal or similar component
  calculations: {
    grossProfit: 0,
    adjustedGrossProfit: 0,
    totalBuyerCommissions: 0,
    totalSellerCommissions: 0,
    totalCommissions: 0,
    netProfit: 0,
  },
};

const commissionSlice = createSlice({
  name: "commission",
  initialState,
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
    calculateCommissions(state, action) {
      const { grossProfit } = action.payload;

      // Use utility functions for calculations
      const totalFlatBuyerCommissions = calculateTotalFlatCommissions(
        state.commissions,
        "Buyer"
      );
      const totalFlatSellerCommissions = calculateTotalFlatCommissions(
        state.commissions,
        "Seller"
      );
      const adjustedGrossProfit =
        grossProfit - totalFlatBuyerCommissions - totalFlatSellerCommissions;

      calculatePercentageCommissions(
        state.commissions,
        adjustedGrossProfit,
        "Buyer"
      );
      calculatePercentageCommissions(
        state.commissions,
        adjustedGrossProfit,
        "Seller"
      );

      const totalBuyerCommissions = sumCommissionsByCategory(
        state.commissions,
        "Buyer"
      );
      const totalSellerCommissions = sumCommissionsByCategory(
        state.commissions,
        "Seller"
      );
      const totalCommissions = totalBuyerCommissions + totalSellerCommissions;
      const netProfit = calculateNetProfit(grossProfit, totalCommissions);

      // Storing calculated values
      state.calculations = {
        grossProfit,
        adjustedGrossProfit,
        totalBuyerCommissions,
        totalSellerCommissions,
        totalCommissions,
        netProfit,
      };
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchCommissions.fulfilled, (state, action) => {
        state.commissions = action.payload;
        // Optionally trigger calculations here if needed
        // state.dispatch(calculateCommissions({grossProfit: state.calculations.grossProfit}));
      })
      .addCase(addCommission.fulfilled, (state, action) => {
        state.commissions.push(action.payload);
        // Optionally trigger calculations here if needed
      })
      .addCase(deleteCommission.fulfilled, (state, action) => {
        state.commissions = state.commissions.filter(
          (commission) => commission.id !== action.meta.arg.commissionId
        );
        // Optionally trigger calculations here if needed
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
        // Optionally trigger calculations here if needed
      });
  },
});

export const {
  showCommissionModal,
  hideCommissionModal,
  setCurrentCommission,
  calculateCommissions,
} = commissionSlice.actions;

export default commissionSlice.reducer;

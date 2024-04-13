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
  },
};

const commissionSlice = createSlice({
  name: "commission",
  initialState: initialState, // Initial state defined above,
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

      console.log("Received Values:", {
        grossProfit,
      });

      // Calculate total flat buyer and seller commissions
      const totalFlatBuyerCommissions = state.commissions
        .filter((com) => com.category === "Buyer" && com.type === "Flat")
        .reduce((sum, com) => sum + com.amount, 0);

      const totalFlatSellerCommissions = state.commissions
        .filter((com) => com.category === "Seller" && com.type === "Flat")
        .reduce((sum, com) => sum + com.amount, 0);

      // Adjusted gross profit after deducting flat commissions
      const adjustedGrossProfit =
        grossProfit - totalFlatBuyerCommissions - totalFlatSellerCommissions;

      // Calculate percentage commissions based on adjusted gross profit
      state.commissions.forEach((com) => {
        if (com.type !== "Flat" && com.amount === null) {
          // Check for null explicitly
          const percentage = parseFloat(com.type.replace("%", "")) / 100;
          com.amount = adjustedGrossProfit * percentage;
          console.log(`Updated amount for ${com.type}: ${com.amount}`);
        }
      });

      // Calculate total buyer and seller commissions
      const totalBuyerCommissions = state.commissions
        .filter((com) => com.category === "Buyer")
        .reduce((sum, com) => sum + com.amount, 0);

      const totalSellerCommissions = state.commissions
        .filter((com) => com.category === "Seller")
        .reduce((sum, com) => sum + com.amount, 0);

      // Total commissions and net profit calculations
      const totalCommissions = totalBuyerCommissions + totalSellerCommissions;
      const netProfit = grossProfit - totalCommissions;

      // Storing calculated values
      state.calculations.grossProfit = grossProfit;
      state.calculations.totalBuyerCommissions = totalBuyerCommissions;
      state.calculations.totalSellerCommissions = totalSellerCommissions;
      state.calculations.totalCommissions = totalCommissions;
      state.calculations.netProfit = netProfit;
    },
  },

  extraReducers: (builder) => {
    builder
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
          (commission) => commission.id !== action.meta.arg.commissionId
        );
        // Do not trigger calculateCommissions here
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
        // Do not trigger calculateCommissions here
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

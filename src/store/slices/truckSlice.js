import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { db } from "../../firebase";
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
} from "firebase/firestore";

// Async Thunks
export const fetchTruckDetails = createAsyncThunk(
  "truck/fetchTruckDetails",
  async (truckId, { rejectWithValue }) => {
    try {
      const docRef = doc(db, "trucks", truckId);
      const docSnap = await getDoc(docRef);
      if (!docSnap.exists()) throw new Error("No such document!");
      return { ...docSnap.data().truckinfo, id: truckId };
    } catch (error) {
      return rejectWithValue(error.toString());
    }
  }
);

export const addTruck = createAsyncThunk(
  "truck/addTruck",
  async (truckData, { rejectWithValue }) => {
    try {
      const docRef = await addDoc(collection(db, "trucks"), {
        truckinfo: truckData,
      });
      return { ...truckData, id: docRef.id };
    } catch (error) {
      return rejectWithValue(error.toString());
    }
  }
);

export const addMultipleTrucks = createAsyncThunk(
  "truck/addMultipleTrucks",
  async (truckEntries, { rejectWithValue }) => {
    try {
      const addedTrucks = [];
      for (const truckData of truckEntries) {
        const docRef = await addDoc(collection(db, "trucks"), {
          truckinfo: truckData,
        });
        addedTrucks.push({ ...truckData, id: docRef.id });
      }
      return addedTrucks;
    } catch (error) {
      return rejectWithValue(error.toString());
    }
  }
);

export const updateTruckDetails = createAsyncThunk(
  "truck/updateTruckDetails",
  async ({ truckId, truckDetails }, { dispatch, rejectWithValue }) => {
    try {
      await updateDoc(doc(db, "trucks", truckId), { truckinfo: truckDetails });
      dispatch(fetchTruckDetails(truckId)); // Optionally refetch truck details
    } catch (error) {
      return rejectWithValue(error.toString());
    }
  }
);

export const fetchTruckList = createAsyncThunk(
  "truck/fetchTruckList",
  async (_, { rejectWithValue }) => {
    try {
      const truckInfoQuery = query(
        collection(db, "trucks"),
        where("truckinfo", "!=", null)
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
  }
);

export const fetchExpenses = createAsyncThunk(
  "truck/fetchExpenses",
  async (truckId, { rejectWithValue }) => {
    try {
      const expensesRef = collection(db, "trucks", truckId, "expenses");
      const querySnapshot = await getDocs(expensesRef);
      const expenses = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      return expenses;
    } catch (error) {
      return rejectWithValue(error.toString());
    }
  }
);

export const addExpense = createAsyncThunk(
  "truck/addExpense",
  async ({ truckId, expenseData }, { dispatch, rejectWithValue }) => {
    try {
      await addDoc(collection(db, "trucks", truckId, "expenses"), expenseData);
      dispatch(fetchExpenses(truckId)); // Optionally refresh expenses list
    } catch (error) {
      return rejectWithValue(error.toString());
    }
  }
);

export const deleteExpense = createAsyncThunk(
  "truck/deleteExpense",
  async ({ truckId, expenseId }, { dispatch, rejectWithValue }) => {
    try {
      await deleteDoc(doc(db, "trucks", truckId, "expenses", expenseId));
      dispatch(fetchExpenses(truckId)); // Optionally refresh expenses list
    } catch (error) {
      return rejectWithValue(error.toString());
    }
  }
);

export const updateExpense = createAsyncThunk(
  "truck/updateExpense",
  async (
    { truckId, expenseId, expenseData },
    { dispatch, rejectWithValue }
  ) => {
    try {
      const expenseRef = doc(db, "trucks", truckId, "expenses", expenseId);
      await updateDoc(expenseRef, expenseData);
      dispatch(fetchExpenses(truckId)); // Optionally refresh expenses list
    } catch (error) {
      return rejectWithValue(error.toString());
    }
  }
);

export const fetchCommissions = createAsyncThunk(
  "truck/fetchCommissions",
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
  "truck/addCommission",
  async ({ truckId, commissionData }, { dispatch, rejectWithValue }) => {
    try {
      const docRef = await addDoc(
        collection(db, "trucks", truckId, "commissions"),
        commissionData
      );
      console.log("Added commission:", commissionData);
      console.log("To truckId:", truckId);
      dispatch(fetchCommissions(truckId)); // Optionally refresh commissions list
      return { ...commissionData, id: docRef.id }; // Return the new commission with id
    } catch (error) {
      return rejectWithValue(error.toString());
    }
  }
);

export const deleteCommission = createAsyncThunk(
  "truck/deleteCommission",
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
  "truck/updateCommission",
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

// Truck Slice
const initialState = {
  truckInfo: null,
  truckList: [],
  expenses: [],
  commissions: [],
  isExpenseModalOpen: false,
  currentExpense: null,
};

const truckSlice = createSlice({
  name: "truck",
  initialState,
  reducers: {
    // Place for potential reducers for synchronously modifying state
    showExpenseModal(state) {
      state.isExpenseModalOpen = true;
    },
    hideExpenseModal(state) {
      state.isExpenseModalOpen = false;
    },
    setCurrentExpense(state, action) {
      state.currentExpense = action.payload;
    },
    // Add other synchronous reducers as needed
  },

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
      .addCase(fetchExpenses.fulfilled, (state, action) => {
        state.expenses = action.payload;
      })
      .addCase(fetchCommissions.fulfilled, (state, action) => {
        state.commissions = action.payload;
      })
      // Handle add, update, and delete for commissions
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
      })
      // Handle add, update, and delete for expenses
      .addCase(addExpense.fulfilled, (state, action) => {
        state.expenses.push(action.payload);
      })
      .addCase(deleteExpense.fulfilled, (state, action) => {
        state.expenses = state.expenses.filter(
          (expense) => expense.id !== action.meta.arg.expenseId
        );
      })
      .addCase(updateExpense.fulfilled, (state, action) => {
        const index = state.expenses.findIndex(
          (expense) => expense.id === action.meta.arg.expenseId
        );
        if (index !== -1) {
          state.expenses[index] = {
            ...state.expenses[index],
            ...action.meta.arg.expenseData,
          };
        }
      });
  },
});

export const {
  showExpenseModal,
  hideExpenseModal,
  setCurrentExpense,
  fetchTruckDetailsFulfilled,
  addTruckFulfilled,
  fetchTruckListFulfilled,
  fetchExpensesFulfilled,
  fetchCommissionsFulfilled,
  addCommissionFulfilled,
  deleteCommissionFulfilled,
  updateCommissionFulfilled,
  addExpenseFulfilled,
  deleteExpenseFulfilled,
  updateExpenseFulfilled,
} = truckSlice.actions;

export default truckSlice.reducer;

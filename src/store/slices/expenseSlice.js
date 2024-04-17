import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { db } from "../../firebase";
import {
  doc,
  collection,
  getDocs,
  addDoc,
  updateDoc,
  deleteDoc,
  getDoc,
  setDoc,
} from "firebase/firestore";

// Utility function to fetch or initialize total expenses
async function fetchOrInitializeTotals(truckId) {
  const totalsRef = doc(db, "trucks", truckId, "totals", "financials");
  const totalsSnap = await getDoc(totalsRef);
  if (!totalsSnap.exists()) {
    await setDoc(totalsRef, { totalExpenses: 0 }); // Initialize with zero
    return 0;
  }
  return totalsSnap.data().totalExpenses;
}

// Async thunk to fetch total expenses for a truck
export const fetchTotalExpenses = createAsyncThunk(
  "truck/fetchTotalExpenses",
  async (truckId, { rejectWithValue }) => {
    try {
      const totalsRef = doc(db, "trucks", truckId, "totals", "financials");
      const docSnap = await getDoc(totalsRef);
      if (docSnap.exists()) {
        return docSnap.data().totalExpenses;
      }
      return 0; // Return 0 if no document exists
    } catch (error) {
      return rejectWithValue(error.toString());
    }
  }
);

// Utility function to update total expenses
async function updateTotalExpenses(truckId, newTotal) {
  const totalsRef = doc(db, "trucks", truckId, "totals", "financials");
  await setDoc(totalsRef, { totalExpenses: newTotal }, { merge: true });
}

// Async thunk to fetch expenses
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

// Async thunk to add an expense
export const addExpense = createAsyncThunk(
  "truck/addExpense",
  async ({ truckId, expenseData }, { dispatch, rejectWithValue }) => {
    try {
      const docRef = await addDoc(
        collection(db, "trucks", truckId, "expenses"),
        expenseData
      );
      const newExpenseAmount = Number(expenseData.cost) || 0;
      const currentTotal = await fetchOrInitializeTotals(truckId);
      await updateTotalExpenses(truckId, currentTotal + newExpenseAmount);
      dispatch(fetchExpenses(truckId)); // Refresh the expenses list
      return { id: docRef.id, ...expenseData };
    } catch (error) {
      return rejectWithValue(error.toString());
    }
  }
);

// Async thunk to delete an expense
export const deleteExpense = createAsyncThunk(
  "truck/deleteExpense",
  async (
    { truckId, expenseId, expenseCost },
    { dispatch, rejectWithValue }
  ) => {
    try {
      await deleteDoc(doc(db, "trucks", truckId, "expenses", expenseId));
      const currentTotal = await fetchOrInitializeTotals(truckId);
      await updateTotalExpenses(truckId, currentTotal - Number(expenseCost));
      dispatch(fetchExpenses(truckId)); // Refresh the expenses list
    } catch (error) {
      return rejectWithValue(error.toString());
    }
  }
);

// Async thunk to update an expense
export const updateExpense = createAsyncThunk(
  "truck/updateExpense",
  async (
    { truckId, expenseId, expenseData, previousCost },
    { dispatch, rejectWithValue }
  ) => {
    try {
      const expenseRef = doc(db, "trucks", truckId, "expenses", expenseId);
      await updateDoc(expenseRef, expenseData);
      const currentTotal = await fetchOrInitializeTotals(truckId);
      const newExpenseAmount = Number(expenseData.cost) || 0;
      await updateTotalExpenses(
        truckId,
        currentTotal - Number(previousCost) + newExpenseAmount
      );
      dispatch(fetchExpenses(truckId)); // Refresh the expenses list
    } catch (error) {
      return rejectWithValue(error.toString());
    }
  }
);

// Helper function to calculate totals
const calculateTotals = (expenses) => {
  const totals = expenses.reduce((acc, expense) => {
    const category = expense.category;
    const cost = Number(expense.cost) || 0;
    if (!acc[category]) {
      acc[category] = 0;
    }
    acc[category] += cost;
    return acc;
  }, {});
  const totalExpenses = Object.values(totals).reduce(
    (sum, amount) => sum + amount,
    0
  );
  return { totals, totalExpenses };
};

const expenseSlice = createSlice({
  name: "expense",
  initialState: {
    items: [],
    loading: false,
    totalsByCategory: {},
    totalExpenses: 0,
    currentExpense: null,
    isExpenseModalOpen: false,
  },
  reducers: {
    showExpenseModal(state) {
      state.isExpenseModalOpen = true;
    },
    hideExpenseModal(state) {
      state.isExpenseModalOpen = false;
    },
    setCurrentExpense(state, action) {
      state.currentExpense = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchExpenses.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchTotalExpenses.fulfilled, (state, action) => {
        state.totalExpenses = action.payload;
      })
      .addCase(fetchExpenses.fulfilled, (state, action) => {
        state.items = action.payload;
        const { totals, totalExpenses } = calculateTotals(action.payload);
        state.totalsByCategory = totals;
        state.totalExpenses = totalExpenses;
        state.loading = false;
      })
      .addCase(fetchExpenses.rejected, (state, action) => {
        state.loading = false;
        console.error("Error fetching expenses:", action.error.message);
      })
      .addCase(addExpense.fulfilled, (state, action) => {
        state.items.push(action.payload);
      })
      .addCase(deleteExpense.fulfilled, (state, action) => {
        state.items = state.items.filter(
          (expense) => expense.id !== action.meta.arg.expenseId
        );
      })
      .addCase(updateExpense.fulfilled, (state, action) => {
        const index = state.items.findIndex(
          (expense) => expense.id === action.meta.arg.expenseId
        );
        if (index !== -1) {
          state.items[index] = {
            ...state.items[index],
            ...action.meta.arg.expenseData,
          };
        }
      });
  },
});

export const { showExpenseModal, hideExpenseModal, setCurrentExpense } =
  expenseSlice.actions;

export default expenseSlice.reducer;

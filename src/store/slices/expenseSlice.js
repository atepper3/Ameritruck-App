import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { db } from "../../firebase";
import {
  doc,
  collection,
  getDocs,
  addDoc,
  updateDoc,
  deleteDoc,
} from "firebase/firestore";

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
      const docRef = await addDoc(
        collection(db, "trucks", truckId, "expenses"),
        expenseData
      );
      dispatch(fetchExpenses(truckId)); // Refresh the expenses list
      return { id: docRef.id, ...expenseData };
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
      dispatch(fetchExpenses(truckId)); // Refresh the expenses list
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
      dispatch(fetchExpenses(truckId)); // Refresh the expenses list
    } catch (error) {
      return rejectWithValue(error.toString());
    }
  }
);

// Helper function to calculate totals
const calculateTotalsAndGrossProfit = (expenses, purchasePrice, soldPrice) => {
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
  const grossProfit = soldPrice - purchasePrice - totalExpenses;
  return { totals, totalExpenses, grossProfit };
};

const expenseSlice = createSlice({
  name: "expense",
  initialState: {
    items: [],
    loading: false,
    totalsByCategory: {},
    totalExpenses: 0,
    grossProfit: 0,
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
      .addCase(fetchExpenses.fulfilled, (state, action) => {
        state.items = action.payload;
        const { totals, totalExpenses, grossProfit } =
          calculateTotalsAndGrossProfit(
            action.payload,
            state.purchasePrice,
            state.soldPrice
          );
        state.totalsByCategory = totals;
        state.totalExpenses = totalExpenses;
        state.grossProfit = grossProfit;
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
      })
      // Additional actions to handle purchase price and sold price updates
      .addCase(setPurchasePrice, (state, action) => {
        state.purchasePrice = action.payload;
        state.grossProfit =
          state.soldPrice - action.payload - state.totalExpenses;
      })
      .addCase(setSoldPrice, (state, action) => {
        state.soldPrice = action.payload;
        state.grossProfit =
          action.payload - state.purchasePrice - state.totalExpenses;
      });
  },
});

export const { showExpenseModal, hideExpenseModal, setCurrentExpense } =
  expenseSlice.actions;

export default expenseSlice.reducer;

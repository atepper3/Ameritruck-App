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

const expenseSlice = createSlice({
  name: "expenses",
  initialState: {
    items: [],
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
      .addCase(fetchExpenses.fulfilled, (state, action) => {
        state.items = action.payload;
        // After fetching, calculate totals
        const totals = action.payload.reduce((acc, expense) => {
          const category = expense.category;
          const cost = Number(expense.cost) || 0;
          if (!acc[category]) {
            acc[category] = 0;
          }
          acc[category] += cost;
          return acc;
        }, {});

        state.totalsByCategory = totals;
        state.totalExpenses = Object.values(totals).reduce(
          (sum, categoryTotal) => sum + categoryTotal,
          0
        );
      })
      .addCase(addExpense.fulfilled, (state, action) => {
        state.items.push(action.payload); // Corrected from state.expenses to state.items
      })
      .addCase(deleteExpense.fulfilled, (state, action) => {
        state.items = state.items.filter(
          (expense) => expense.id !== action.meta.arg.expenseId
        ); // Corrected from state.expenses to state.items
      })
      .addCase(updateExpense.fulfilled, (state, action) => {
        const index = state.items.findIndex(
          (expense) => expense.id === action.meta.arg.expenseId
        ); // Corrected from state.expenses to state.items
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

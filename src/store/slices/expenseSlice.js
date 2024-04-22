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

// Helper function to fetch or initialize total expenses
async function fetchOrInitializeTotalExpenses(truckId) {
  const totalsRef = doc(db, "trucks", truckId, "totals", "financials");
  const docSnap = await getDoc(totalsRef);
  if (!docSnap.exists()) {
    await setDoc(totalsRef, { totalExpenses: 0 });
    return 0;
  }
  return docSnap.data().totalExpenses;
}

// Helper function to update total expenses in Firestore
async function updateTotalExpenses(truckId, newTotal) {
  const totalsRef = doc(db, "trucks", truckId, "totals", "financials");
  await setDoc(totalsRef, { totalExpenses: newTotal }, { merge: true });
}

// Async thunk to fetch expenses and ensure total expenses are initialized
export const fetchExpenses = createAsyncThunk(
  "truck/fetchExpenses",
  async (truckId, { rejectWithValue, dispatch }) => {
    try {
      const totalExpenses = await fetchOrInitializeTotalExpenses(truckId);
      dispatch(setTotalExpenses(totalExpenses));

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

// Adding an expense and updating total expenses
export const addExpense = createAsyncThunk(
  "truck/addExpense",
  async ({ truckId, expenseData }, { rejectWithValue, dispatch }) => {
    try {
      const costAsNumber = Number(expenseData.cost);
      if (isNaN(costAsNumber)) {
        console.error("Invalid cost value", expenseData.cost);
        return rejectWithValue("Invalid cost value");
      }
      const docRef = await addDoc(
        collection(db, "trucks", truckId, "expenses"),
        { ...expenseData, cost: costAsNumber }
      );
      const newExpense = { id: docRef.id, ...expenseData, cost: costAsNumber };
      const totalExpenses = await fetchOrInitializeTotalExpenses(truckId);
      await updateTotalExpenses(truckId, totalExpenses + costAsNumber);
      dispatch(setTotalExpenses(totalExpenses + costAsNumber));
      return newExpense;
    } catch (error) {
      return rejectWithValue(error.toString());
    }
  }
);

// Deleting an expense and updating total expenses
export const deleteExpense = createAsyncThunk(
  "truck/deleteExpense",
  async (
    { truckId, expenseId, expenseCost },
    { rejectWithValue, dispatch }
  ) => {
    try {
      await deleteDoc(doc(db, "trucks", truckId, "expenses", expenseId));
      const totalExpenses = await fetchOrInitializeTotalExpenses(truckId);
      await updateTotalExpenses(truckId, totalExpenses - expenseCost);
      dispatch(setTotalExpenses(totalExpenses - expenseCost));
      return { truckId, expenseId, expenseCost: -expenseCost };
    } catch (error) {
      return rejectWithValue(error.toString());
    }
  }
);

// Updating an expense and adjusting total expenses
export const updateExpense = createAsyncThunk(
  "truck/updateExpense",
  async (
    { truckId, expenseId, expenseData, previousCost },
    { rejectWithValue, dispatch }
  ) => {
    try {
      const newExpenseAmount = Number(expenseData.cost);
      if (isNaN(newExpenseAmount)) {
        console.error("Error: Invalid cost value");
        return rejectWithValue("Invalid cost value");
      }
      await updateDoc(doc(db, "trucks", truckId, "expenses", expenseId), {
        ...expenseData,
        cost: newExpenseAmount,
      });
      const totalExpenses = await fetchOrInitializeTotalExpenses(truckId);
      const newTotal = totalExpenses + newExpenseAmount - previousCost;
      await updateTotalExpenses(truckId, newTotal);
      dispatch(setTotalExpenses(newTotal));
      return {
        id: expenseId,
        ...expenseData,
        cost: newExpenseAmount,
        delta: newExpenseAmount - previousCost,
      };
    } catch (error) {
      return rejectWithValue(error.toString());
    }
  }
);

// Calculate totals by category
function calculateCategoryTotals(expenses) {
  return expenses.reduce((acc, expense) => {
    const category = expense.category;
    const cost = Number(expense.cost) || 0;
    if (!acc[category]) {
      acc[category] = 0;
    }
    acc[category] += cost;
    return acc;
  }, {});
}

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
    setTotalExpenses(state, action) {
      state.totalExpenses = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchExpenses.fulfilled, (state, action) => {
        state.items = action.payload;
        state.totalsByCategory = calculateCategoryTotals(action.payload);
        state.loading = false;
      })
      .addCase(addExpense.fulfilled, (state, action) => {
        state.items.push(action.payload);
        state.totalsByCategory = calculateCategoryTotals(state.items);
      })
      .addCase(deleteExpense.fulfilled, (state, action) => {
        state.items = state.items.filter(
          (item) => item.id !== action.meta.arg.expenseId
        );
        state.totalsByCategory = calculateCategoryTotals(state.items);
      })
      .addCase(updateExpense.fulfilled, (state, action) => {
        const index = state.items.findIndex(
          (item) => item.id === action.payload.id
        );
        if (index !== -1) {
          state.items[index] = { ...state.items[index], ...action.payload };
        }
        state.totalsByCategory = calculateCategoryTotals(state.items);
      });
  },
});

export const {
  showExpenseModal,
  hideExpenseModal,
  setCurrentExpense,
  setTotalExpenses,
} = expenseSlice.actions;

export default expenseSlice.reducer;

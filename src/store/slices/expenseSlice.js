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

export const addExpense = createAsyncThunk(
  "truck/addExpense",
  async ({ truckId, expenseData }, { rejectWithValue }) => {
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
      return { id: docRef.id, ...expenseData, cost: costAsNumber };
    } catch (error) {
      return rejectWithValue(error.toString());
    }
  }
);

export const deleteExpense = createAsyncThunk(
  "truck/deleteExpense",
  async ({ truckId, expenseId, expenseCost }, { rejectWithValue }) => {
    try {
      await deleteDoc(doc(db, "trucks", truckId, "expenses", expenseId));
      return { truckId, expenseId, expenseCost: -Number(expenseCost) }; // No need to handle total here
    } catch (error) {
      return rejectWithValue(error.toString());
    }
  }
);

export const updateExpense = createAsyncThunk(
  "truck/updateExpense",
  async (
    { truckId, expenseId, expenseData, previousCost },
    { rejectWithValue }
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
      return {
        truckId,
        expenseId,
        delta: newExpenseAmount - Number(previousCost),
      };
    } catch (error) {
      return rejectWithValue(error.toString());
    }
  }
);

// Helper function to calculate category totals only
const calculateCategoryTotals = (expenses) => {
  const totalsByCategory = expenses.reduce((acc, expense) => {
    const category = expense.category;
    const cost = Number(expense.cost) || 0;
    if (!acc[category]) {
      acc[category] = 0;
    }
    acc[category] += cost;
    return acc;
  }, {});
  return totalsByCategory;
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
        state.totalsByCategory = calculateCategoryTotals(action.payload);
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
          (expense) => expense.id === action.payload.id
        );
        if (index !== -1) {
          state.items[index] = action.payload; // Update the expense in the state with the returned payload
        }
      });
  },
});

export const { showExpenseModal, hideExpenseModal, setCurrentExpense } =
  expenseSlice.actions;

export default expenseSlice.reducer;

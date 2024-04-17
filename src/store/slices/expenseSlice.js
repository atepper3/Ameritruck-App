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
    console.log("Initialising total expenses to 0 as it does not exist.");
    await setDoc(totalsRef, { totalExpenses: 0 }); // Initialize with zero
    return 0; // Ensure returning a number
  }
  const totalExpenses = totalsSnap.data().totalExpenses;
  if (typeof totalExpenses !== "number" || isNaN(totalExpenses)) {
    console.error("Fetched total expenses is not a number, initializing to 0.");
    await setDoc(totalsRef, { totalExpenses: 0 });
    return 0; // Safe fallback
  }
  return totalExpenses;
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

async function updateTotalExpenses(truckId, newTotal) {
  if (isNaN(newTotal)) {
    console.error("Attempted to update total expenses with NaN", newTotal);
    return; // Prevent update if newTotal is NaN
  }
  const totalsRef = doc(db, "trucks", truckId, "totals", "financials");
  console.log("Updating total expenses to:", newTotal);
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

export const addExpense = createAsyncThunk(
  "truck/addExpense",
  async ({ truckId, expenseData }, { dispatch, rejectWithValue }) => {
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
      const currentTotal = await fetchOrInitializeTotals(truckId);
      console.log("New expense amount:", costAsNumber);
      console.log("Current total:", currentTotal);
      await updateTotalExpenses(truckId, currentTotal + costAsNumber);
      dispatch(fetchExpenses(truckId));
      return { id: docRef.id, ...expenseData, cost: costAsNumber };
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

export const updateExpense = createAsyncThunk(
  "truck/updateExpense",
  async (
    { truckId, expenseId, expenseData, previousCost },
    { dispatch, rejectWithValue }
  ) => {
    try {
      // Log the original data received
      console.log(
        "Received data for update:",
        expenseData.cost,
        "Previous cost:",
        previousCost
      );

      const newExpenseAmount = Number(expenseData.cost);
      const previousExpenseAmount = Number(previousCost);

      // Log the converted numbers
      console.log(
        "Converted new expense amount:",
        newExpenseAmount,
        "Converted previous expense amount:",
        previousExpenseAmount
      );

      if (isNaN(newExpenseAmount) || isNaN(previousExpenseAmount)) {
        console.error("Error: Invalid cost value");
        return rejectWithValue("Invalid cost value");
      }

      const expenseRef = doc(db, "trucks", truckId, "expenses", expenseId);
      await updateDoc(expenseRef, {
        ...expenseData,
        cost: newExpenseAmount, // Ensure cost is updated as a number
      });

      const currentTotal = await fetchOrInitializeTotals(truckId);
      await updateTotalExpenses(
        truckId,
        currentTotal - previousExpenseAmount + newExpenseAmount
      );

      dispatch(fetchExpenses(truckId)); // Refresh the expenses list after update
      dispatch(fetchTotalExpenses(truckId)); // Refresh the total expenses

      // This will return the updated expense data which should be handled in your Redux slice to update the state
      return {
        id: expenseId,
        ...expenseData,
        cost: newExpenseAmount,
      };
    } catch (error) {
      console.error("Update expense failed with error:", error);
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

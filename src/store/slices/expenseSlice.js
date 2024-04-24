import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import {
  doc,
  collection,
  getDocs,
  addDoc,
  updateDoc,
  deleteDoc,
  getDoc,
  setDoc,
  onSnapshot,
} from 'firebase/firestore';
import { db } from '../../firebase';

// Async thunk to fetch expenses
export const fetchExpenses = createAsyncThunk(
  'truck/fetchExpenses',
  async (truckId, { rejectWithValue }) => {
    try {
      const expensesRef = collection(db, 'trucks', truckId, 'expenses');
      const querySnapshot = await getDocs(expensesRef);
      const expenses = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      return expenses;
    } catch (error) {
      return rejectWithValue(error.toString());
    }
  },
);

// Adding an expense
export const addExpense = createAsyncThunk(
  'truck/addExpense',
  async ({ truckId, expenseData }, { rejectWithValue }) => {
    try {
      const costAsNumber = Number(expenseData.cost);
      if (isNaN(costAsNumber)) {
        console.error('Invalid cost value', expenseData.cost);
        return rejectWithValue('Invalid cost value');
      }
      const docRef = await addDoc(
        collection(db, 'trucks', truckId, 'expenses'),
        { ...expenseData, cost: costAsNumber },
      );
      return { id: docRef.id, ...expenseData, cost: costAsNumber };
    } catch (error) {
      return rejectWithValue(error.toString());
    }
  },
);

// Deleting an expense
export const deleteExpense = createAsyncThunk(
  'truck/deleteExpense',
  async ({ truckId, expenseId }, { rejectWithValue }) => {
    try {
      await deleteDoc(doc(db, 'trucks', truckId, 'expenses', expenseId));
      return { truckId, expenseId };
    } catch (error) {
      return rejectWithValue(error.toString());
    }
  },
);

// Updating an expense
export const updateExpense = createAsyncThunk(
  'truck/updateExpense',
  async ({ truckId, expenseId, expenseData }, { rejectWithValue }) => {
    try {
      const newExpenseAmount = Number(expenseData.cost);
      if (isNaN(newExpenseAmount)) {
        console.error('Error: Invalid cost value');
        return rejectWithValue('Invalid cost value');
      }
      await updateDoc(doc(db, 'trucks', truckId, 'expenses', expenseId), {
        ...expenseData,
        cost: newExpenseAmount,
      });
      return { id: expenseId, ...expenseData, cost: newExpenseAmount };
    } catch (error) {
      return rejectWithValue(error.toString());
    }
  },
);

export const fetchTotalExpenses = createAsyncThunk(
  'expenses/fetchTotalExpenses',
  async (truckId, { dispatch, rejectWithValue }) => {
    const totalsRef = doc(db, 'trucks', truckId, 'totals', 'financials');
    try {
      const unsubscribe = onSnapshot(totalsRef, (docSnapshot) => {
        if (docSnapshot.exists()) {
          const data = docSnapshot.data();
          dispatch(setTotalExpenses(data.totalExpenses));
        } else {
          console.error('No total expenses data found');
          rejectWithValue('No total expenses data found');
        }
      });
      // Returning the unsubscribe function in case you want to stop listening later
      return () => unsubscribe();
    } catch (error) {
      console.error('Failed to set up snapshot listener:', error);
      return rejectWithValue(
        error.message || 'Could not set up snapshot listener',
      );
    }
  },
);

const expenseSlice = createSlice({
  name: 'expense',
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
      console.log('Total expenses updated', action.payload);
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchExpenses.fulfilled, (state, action) => {
        state.items = action.payload;
        state.loading = false;
      })
      .addCase(addExpense.fulfilled, (state, action) => {
        state.items.push(action.payload);
      })
      .addCase(deleteExpense.fulfilled, (state, action) => {
        state.items = state.items.filter(
          (item) => item.id !== action.meta.arg.expenseId,
        );
      })
      .addCase(updateExpense.fulfilled, (state, action) => {
        const index = state.items.findIndex(
          (item) => item.id === action.payload.id,
        );
        if (index !== -1) {
          state.items[index] = { ...state.items[index], ...action.payload };
        }
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

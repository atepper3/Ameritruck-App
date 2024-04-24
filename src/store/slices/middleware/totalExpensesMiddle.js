import { createListenerMiddleware } from '@reduxjs/toolkit';
import {
  doc, setDoc, getDoc, collection, getDocs,
} from 'firebase/firestore';
import {
  addExpense,
  deleteExpense,
  updateExpense,
  setTotalExpenses, // Assuming you have added this action in your slice to update the total directly
} from '../expenseSlice';
import { db } from '../../../firebase';

// Function to update or initialize total expenses in the database and update Redux state
async function updateTotalExpenses(truckId, delta, listenerApi) {
  const totalsRef = doc(db, 'trucks', truckId, 'totals', 'financials');
  const totalsSnap = await getDoc(totalsRef);
  const currentTotal = totalsSnap.exists()
    ? Number(totalsSnap.data().totalExpenses)
    : 0;
  const newTotal = currentTotal + delta;
  await setDoc(totalsRef, { totalExpenses: newTotal }, { merge: true });
  listenerApi.dispatch(setTotalExpenses(newTotal));
}

// Function to recalculate the total expenses based on all records in the database
async function recalculateTotalExpenses(truckId, listenerApi) {
  const expensesRef = collection(db, 'trucks', truckId, 'expenses');
  const expenseSnap = await getDocs(expensesRef);
  let total = 0;
  expenseSnap.forEach((doc) => {
    total += Number(doc.data().cost);
  });
  await setDoc(
    doc(db, 'trucks', truckId, 'totals', 'financials'),
    { totalExpenses: total },
    { merge: true },
  );
  listenerApi.dispatch(setTotalExpenses(total));
}

const totalExpensesMiddleware = createListenerMiddleware();

// Listeners for CRUD operations on expenses to update totals
totalExpensesMiddleware.startListening({
  actionCreator: addExpense.fulfilled,
  effect: async (action, listenerApi) => {
    const { truckId, expenseData } = action.meta.arg;
    const costAsNumber = Number(expenseData.cost);
    await updateTotalExpenses(truckId, costAsNumber, listenerApi);
  },
});

totalExpensesMiddleware.startListening({
  actionCreator: deleteExpense.fulfilled,
  effect: async (action, listenerApi) => {
    const { truckId, expenseCost } = action.meta.arg;
    const costAsNumber = -Number(expenseCost);
    await updateTotalExpenses(truckId, costAsNumber, listenerApi);
  },
});

totalExpensesMiddleware.startListening({
  actionCreator: updateExpense.fulfilled,
  effect: async (action, listenerApi) => {
    const { truckId, delta } = action.meta.arg;
    await updateTotalExpenses(truckId, delta, listenerApi);
  },
});

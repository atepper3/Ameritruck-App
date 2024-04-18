import { createListenerMiddleware } from "@reduxjs/toolkit";
import {
  addExpense,
  deleteExpense,
  updateExpense,
} from "../../slices/expenseSlice";
import { db } from "../../../firebase";
import { doc, setDoc, getDoc } from "firebase/firestore";

// Update or initialize the total expenses in the database
async function updateTotalExpenses(truckId, delta) {
  const totalsRef = doc(db, "trucks", truckId, "totals", "financials");
  const totalsSnap = await getDoc(totalsRef);
  let currentTotal = totalsSnap.exists()
    ? Number(totalsSnap.data().totalExpenses)
    : 0;
  const newTotal = currentTotal + delta;
  await setDoc(totalsRef, { totalExpenses: newTotal }, { merge: true });
}

const totalExpensesMiddle = createListenerMiddleware();

// Listening for when an expense is added to update the total
totalExpensesMiddle.startListening({
  actionCreator: addExpense.fulfilled,
  effect: async (action, listenerApi) => {
    const { truckId, expenseData } = action.meta.arg;
    const costAsNumber = Number(expenseData.cost); // Ensure cost is treated as a number
    await updateTotalExpenses(truckId, costAsNumber);
  },
});

// Listening for when an expense is deleted to update the total
totalExpensesMiddle.startListening({
  actionCreator: deleteExpense.fulfilled,
  effect: async (action, listenerApi) => {
    const { truckId, expenseCost } = action.meta.arg; // Removed unused expenseId here
    const costAsNumber = -Number(expenseCost); // Negative because we're subtracting this expense
    await updateTotalExpenses(truckId, costAsNumber);
  },
});

// Listening for when an expense is updated to update the total correctly
totalExpensesMiddle.startListening({
  actionCreator: updateExpense.fulfilled,
  effect: async (action, listenerApi) => {
    const { truckId, delta } = action.meta.arg; // Kept delta which includes expenseId's effect
    await updateTotalExpenses(truckId, delta);
  },
});

export default totalExpensesMiddle.middleware;

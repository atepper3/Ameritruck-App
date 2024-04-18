import { createListenerMiddleware } from "@reduxjs/toolkit";
import { db } from "../../firebase";
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

const expenseMiddleware = createListenerMiddleware();

// Listening for when an expense is added to update the total
expenseMiddleware.startListening({
  actionCreator: addExpense.fulfilled,
  effect: async (action, listenerApi) => {
    const { truckId, expenseData } = action.meta.arg;
    const costAsNumber = Number(expenseData.cost); // Ensure cost is treated as a number
    await updateTotalExpenses(truckId, costAsNumber);
  },
});

// Listening for when an expense is deleted to update the total
expenseMiddleware.startListening({
  actionCreator: deleteExpense.fulfilled,
  effect: async (action, listenerApi) => {
    const { truckId, expenseId, expenseCost } = action.meta.arg;
    const costAsNumber = -Number(expenseCost); // Negative because we're subtracting this expense
    await updateTotalExpenses(truckId, costAsNumber);
  },
});

// Listening for when an expense is updated to update the total correctly
expenseMiddleware.startListening({
  actionCreator: updateExpense.fulfilled,
  effect: async (action, listenerApi) => {
    const { truckId, expenseId, expenseData, previousCost } = action.meta.arg;
    const delta = Number(expenseData.cost) - Number(previousCost);
    await updateTotalExpenses(truckId, delta);
  },
});

export default expenseMiddleware;

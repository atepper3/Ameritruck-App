import { createListenerMiddleware } from "@reduxjs/toolkit";
import {
  fetchExpenses,
  addExpense,
  deleteExpense,
  updateExpense,
} from "../expenseSlice";
import { fetchTruckDetails, updateTruckDetails } from "../truckSlice";
import { calculateCommissions } from "../commissionSlice"; // Import the action

const listenerMiddleware = createListenerMiddleware();

let lastValues = {
  soldPrice: undefined,
  purchasePrice: undefined,
  totalExpenses: undefined,
};

function dispatchCalculations(listenerApi) {
  const state = listenerApi.getState();
  const { expense, truck } = state;
  const totalExpenses = expense.totalExpenses;
  const { soldPrice, purchasePrice } = truck.truckInfo;

  // Check if key values have changed before dispatching
  if (
    soldPrice !== lastValues.soldPrice ||
    purchasePrice !== lastValues.purchasePrice ||
    totalExpenses !== lastValues.totalExpenses
  ) {
    if (
      soldPrice !== undefined &&
      purchasePrice !== undefined &&
      totalExpenses !== undefined
    ) {
      const grossProfit = soldPrice - purchasePrice - totalExpenses;
      console.log("Calculated grossProfit:", grossProfit);
      listenerApi.dispatch(calculateCommissions({ grossProfit }));
      lastValues = { soldPrice, purchasePrice, totalExpenses };
    } else {
      console.error("Missing data for gross profit calculation:", {
        soldPrice,
        purchasePrice,
        totalExpenses,
      });
    }
  }
}

listenerMiddleware.startListening({
  matcher: (action) =>
    fetchExpenses.fulfilled.match(action) ||
    addExpense.fulfilled.match(action) ||
    deleteExpense.fulfilled.match(action) ||
    updateExpense.fulfilled.match(action) ||
    fetchTruckDetails.fulfilled.match(action) ||
    updateTruckDetails.fulfilled.match(action),
  effect: (action, listenerApi) => {
    dispatchCalculations(listenerApi);
  },
});

export default grossProfitMiddle;

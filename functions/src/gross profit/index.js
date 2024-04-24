const functions = require('firebase-functions');
const admin = require('firebase-admin');

// Check if the Firebase app has already been initialized
if (!admin.apps.length) {
  admin.initializeApp();
}

exports.updateGrossProfit = functions.firestore
  .document('trucks/{truckId}')
  .onUpdate(async (change, context) => {
    const newData = change.after.data();
    const { soldPrice } = newData.truckinfo;
    const { purchasePrice } = newData.truckinfo;

    // Fetch total expenses from Firestore
    const totalExpensesRef = admin
      .firestore()
      .doc(`trucks/${context.params.truckId}/totals/financials`);
    const totalExpensesSnapshot = await totalExpensesRef.get();
    const { totalExpenses } = totalExpensesSnapshot.data();

    // Calculate gross profit
    const grossProfit = soldPrice - purchasePrice - totalExpenses;

    // Update gross profit in Firestore
    const grossProfitRef = admin
      .firestore()
      .doc(`trucks/${context.params.truckId}/totals/financials`);
    await grossProfitRef.update({ grossProfit });
  });

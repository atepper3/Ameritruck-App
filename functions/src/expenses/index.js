const functions = require('firebase-functions');
const admin = require('firebase-admin');

if (!admin.apps.length) {
  admin.initializeApp();
}

exports.calculateExpensesTotals = functions.firestore
  .document('trucks/{truckId}/expenses/{expenseId}')
  .onWrite(async (change, context) => {
    const { truckId } = context.params;
    const expenseRef = admin
      .firestore()
      .collection('trucks')
      .doc(truckId)
      .collection('expenses');
    const totalsRef = admin
      .firestore()
      .doc(`trucks/${truckId}/totals/financials`);

    let totalExpenses = 0;

    // Calculate the new total expenses
    const expensesSnapshot = await expenseRef.get();
    expensesSnapshot.forEach((doc) => {
      const expense = doc.data();
      totalExpenses += Number(expense.cost || 0);
    });

    // Update only the total expenses in Firestore
    await totalsRef.set({ totalExpenses }, { merge: true });

    // Trigger the gross profit update
    const truckRef = admin.firestore().doc(`trucks/${truckId}`);
    const truckSnapshot = await truckRef.get();
    const truckData = truckSnapshot.data();
    if (truckData) {
      const { soldPrice } = truckData.truckinfo;
      const { purchasePrice } = truckData.truckinfo;
      const grossProfit = soldPrice - purchasePrice - totalExpenses;
      await totalsRef.update({ grossProfit });
    }
  });

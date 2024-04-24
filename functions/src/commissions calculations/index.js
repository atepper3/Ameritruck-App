const functions = require('firebase-functions');
const admin = require('firebase-admin');

if (!admin.apps.length) {
  admin.initializeApp();
}

// Function to recalculate percentage commissions when adjustedGrossProfit updates
exports.recalculatePercentageCommissions = functions.firestore
  .document('trucks/{truckId}/totals/financials')
  .onUpdate(async (change, context) => {
    const { truckId } = context.params;
    const { adjustedGrossProfit } = change.after.data();

    // Define a reference to the commissions collection
    const commissionsRef = admin
      .firestore()
      .collection(`trucks/${truckId}/commissions`);

    // Fetch only the percentage commissions (10% or 15%)
    const querySnapshot = await commissionsRef
      .where('type', 'in', ['10%', '15%'])
      .get();

    const batch = admin.firestore().batch();

    querySnapshot.forEach((doc) => {
      const commission = doc.data();
      const percentage = parseFloat(commission.type.replace('%', '')) / 100;
      const newAmount = adjustedGrossProfit * percentage;
      batch.update(doc.ref, { amount: newAmount });
    });

    await batch.commit();
    console.log('Percentage commissions recalculated for Truck ID:', truckId);
  });

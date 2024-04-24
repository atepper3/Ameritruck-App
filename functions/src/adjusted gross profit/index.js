const functions = require('firebase-functions');
const admin = require('firebase-admin');

if (!admin.apps.length) {
  admin.initializeApp();
}

exports.calculateAdjustedGrossProfit = functions.firestore
  .document('trucks/{truckId}/commissions/{commissionId}')
  .onWrite(async (change, context) => {
    const { truckId } = context.params;

    // Get the current grossProfit from the financials document
    const financialsRef = admin
      .firestore()
      .doc(`trucks/${truckId}/totals/financials`);
    const financialsSnapshot = await financialsRef.get();
    if (!financialsSnapshot.exists) {
      console.log('Financials document does not exist');
      return null;
    }
    const financialsData = financialsSnapshot.data();
    const grossProfit = financialsData.grossProfit || 0;

    // Fetch all commissions that are flat
    const commissionsRef = admin
      .firestore()
      .collection(`trucks/${truckId}/commissions`);
    const querySnapshot = await commissionsRef
      .where('type', '==', 'Flat')
      .get();
    let totalFlatCommissions = 0;
    querySnapshot.forEach((doc) => {
      totalFlatCommissions += doc.data().amount || 0;
    });

    // Calculate adjustedGrossProfit
    const adjustedGrossProfit = grossProfit - totalFlatCommissions;

    // Update or create adjustedGrossProfit in financials
    return financialsRef.set({ adjustedGrossProfit }, { merge: true });
  });

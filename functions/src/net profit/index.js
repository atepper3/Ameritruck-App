const functions = require("firebase-functions");
const admin = require("firebase-admin");

// Ensure Firebase is initialized
if (!admin.apps.length) {
  admin.initializeApp();
}

exports.calculateNetProfit = functions.firestore
  .document("trucks/{truckId}/totals/financials")
  .onWrite(async (change, context) => {
    const truckId = context.params.truckId;
    const financialData = change.after.exists ? change.after.data() : {};

    const grossProfit = financialData.grossProfit || 0;
    const totalCommissions = financialData.totalCommissions || 0;

    const netProfit = grossProfit - totalCommissions;

    await change.after.ref.set({ netProfit }, { merge: true });
    console.log(`Net profit updated for truck ${truckId}: ${netProfit}`);
  });

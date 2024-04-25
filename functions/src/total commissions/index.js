const functions = require("firebase-functions");
const admin = require("firebase-admin");

// Check if the Firebase app has already been initialized
if (!admin.apps.length) {
  admin.initializeApp();
}

exports.totalCommissions = functions.firestore
  .document("trucks/{truckId}/commissions/{commissionId}")
  .onWrite(async (change, context) => {
    const truckId = context.params.truckId;
    const commissionsRef = admin
      .firestore()
      .collection(`trucks/${truckId}/commissions`);

    try {
      const snapshot = await commissionsRef.get();
      let total = 0;
      snapshot.forEach((doc) => {
        const commission = doc.data();
        total += commission.amount || 0;
      });

      const totalsRef = admin
        .firestore()
        .doc(`trucks/${truckId}/totals/financials`);
      await totalsRef.set({ totalCommissions: total }, { merge: true });
      console.log("Total Commissions updated successfully.");
    } catch (error) {
      console.error("Error updating total commissions:", error);
    }
  });

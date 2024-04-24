const admin = require('firebase-admin');

admin.initializeApp();

const expensesFunctions = require('./src/expenses');
const grossProfitFunctions = require('./src/gross profit');
const adjustedGrossProfitFunctions = require('./src/adjusted gross profit');
const percentageCommissionsFunctions = require('./src/commissions calculations');

exports.calculateExpensesTotals = expensesFunctions.calculateExpensesTotals;
exports.updateGrossProfit = grossProfitFunctions.updateGrossProfit;
exports.calculateAdjustedGrossProfit = adjustedGrossProfitFunctions.calculateAdjustedGrossProfit;
exports.recalculatePercentageCommissions = percentageCommissionsFunctions.recalculatePercentageCommissions;

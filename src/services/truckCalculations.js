// commissionCalculations.js

/**
 * Calculates gross profit.
 * @param {number} salePrice - The sale price of the truck.
 * @param {number} purchasePrice - The purchase price of the truck.
 * @param {number} totalExpenses - Total expenses related to the truck.
 * @return {number} Gross profit.
 */
export const calculateGrossProfit = (
  salePrice,
  purchasePrice,
  totalExpenses
) => {
  return salePrice - purchasePrice - totalExpenses;
};

/**
 * Calculates total flat commissions for a given category.
 * @param {Array} commissions - List of all commission objects.
 * @param {string} category - Category of commissions to filter by ('Buyer' or 'Seller').
 * @return {number} Total flat commissions for the category.
 */
export const calculateTotalFlatCommissions = (commissions, category) => {
  return commissions
    .filter((com) => com.category === category && com.type === "Flat")
    .reduce((sum, com) => sum + com.amount, 0);
};

/**
 * Calculates percentage commissions based on adjusted gross profit.
 * @param {Array} commissions - List of commission objects to be updated.
 * @param {number} adjustedGrossProfit - The adjusted gross profit after flat commissions.
 * @param {string} category - 'Buyer' or 'Seller' to filter and apply percentage commissions.
 */
export const calculatePercentageCommissions = (
  commissions,
  adjustedGrossProfit,
  category
) => {
  commissions.forEach((com) => {
    if (
      com.category === category &&
      com.type !== "Flat" &&
      com.amount === null
    ) {
      const percentage = parseFloat(com.type.replace("%", "")) / 100;
      com.amount = adjustedGrossProfit * percentage;
    }
  });
};

/**
 * Sums all commissions for a specified category.
 * @param {Array} commissions - Array of commission objects.
 * @param {string} category - 'Buyer' or 'Seller'.
 * @return {number} Total commissions for the specified category.
 */
export const sumCommissionsByCategory = (commissions, category) => {
  return commissions
    .filter((com) => com.category === category)
    .reduce((sum, com) => sum + (com.amount || 0), 0); // Ensure amount is a number, default to 0
};

/**
 * Calculates the net profit by subtracting total commissions from gross profit.
 * @param {number} grossProfit - Calculated gross profit.
 * @param {number} totalCommissions - Sum of all commissions.
 * @return {number} Net profit.
 */
export const calculateNetProfit = (grossProfit, totalCommissions) => {
  return grossProfit - totalCommissions;
};

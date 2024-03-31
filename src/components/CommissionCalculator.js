import React from 'react';
import { Table } from 'react-bootstrap';

const CommissionCalculator = ({
    sellerCommissions,
    buyerCommissions,
    purchasePrice,
    soldPrice,
    expenses,
}) => {
    const parseNumber = (val) => Number(val) || 0;

    // Step 1: Calculate initial gross profit
    const totalExpenses = expenses.reduce((sum, expense) => sum + parseNumber(expense.cost), 0);
    const grossProfit = parseNumber(soldPrice) - parseNumber(purchasePrice) - totalExpenses;

    // Step 2: Calculate flat commissions for both sellers and buyers
    const totalFlatSellerCommissions = sellerCommissions
        .filter(commission => commission.type.includes('Flat'))
        .reduce((sum, commission) => sum + parseNumber(commission.amount), 0);

    const totalFlatBuyerCommissions = buyerCommissions
        .filter(commission => commission.type.includes('Flat'))
        .reduce((sum, commission) => sum + parseNumber(commission.amount), 0);

    // Step 3: Calculate adjusted gross profit for percentage commissions
    const adjustedGrossProfit = grossProfit - totalFlatSellerCommissions - totalFlatBuyerCommissions;

    // Step 4: Calculate percentage commissions on the adjusted gross profit
    const calculatePercentageCommissions = (commissions) => 
        commissions
            .filter(commission => commission.type.includes('%'))
            .reduce((sum, commission) => sum + adjustedGrossProfit * (parseNumber(commission.amount.replace('%', '')) / 100), 0);

    const totalPercentageSellerCommissions = calculatePercentageCommissions(sellerCommissions);
    const totalPercentageBuyerCommissions = calculatePercentageCommissions(buyerCommissions);

    // Step 5: Sum up total commissions for sellers and buyers
    const totalSellerCommissions = totalFlatSellerCommissions + totalPercentageSellerCommissions;
    const totalBuyerCommissions = totalFlatBuyerCommissions + totalPercentageBuyerCommissions;

    // Step 6: Calculate total commissions and net profit
    const totalCommissions = totalSellerCommissions + totalBuyerCommissions;
    const netProfit = grossProfit - totalCommissions;

    return (
        <Table striped bordered hover variant="dark"> {/* Apply dark theme here */}
            <thead>
                <tr>
                    <th>Category</th>
                    <th>Amount</th>
                </tr>
            </thead>
            <tbody>
                <tr>
                    <td>Gross Profit</td>
                    <td>${grossProfit.toFixed(2)}</td>
                </tr>
                <tr>
                    <td>Buyer Commission</td>
                    <td>${totalBuyerCommissions.toFixed(2)}</td>
                </tr>
                <tr>
                    <td>Seller Commission</td>
                    <td>${totalSellerCommissions.toFixed(2)}</td>
                </tr>    
                <tr>
                    <td>Total Commission</td>
                    <td>${totalCommissions.toFixed(2)}</td>
                </tr>
                <tr>
                    <td>Net Profit</td>
                    <td>${netProfit.toFixed(2)}</td>
                </tr>
            </tbody>
        </Table>
    );
};

export default CommissionCalculator;

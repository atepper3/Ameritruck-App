import React from 'react';
import { Button, Table } from 'react-bootstrap';
import { db } from '../firebase';
import { doc, deleteDoc } from 'firebase/firestore';

const ExpenseList = ({ expenses, truckId, setExpenses, setSelectedExpense, setShowExpenseModal }) => {
    const handleDeleteExpense = async (expenseId) => {
        if (window.confirm('Are you sure you want to delete this expense?')) {
            try {
                await deleteDoc(doc(db, 'trucks', truckId, 'expenses', expenseId));
                setExpenses(currentExpenses => currentExpenses.filter(expense => expense.id !== expenseId));
            } catch (error) {
                console.error('Error deleting expense:', error);
                alert('Failed to delete expense.');
            }
        }
    };

    const handleEditExpense = (expense) => {
        setSelectedExpense(expense);
        setShowExpenseModal(true);
    };

    // Calculate the total expenses
    const totalExpenses = expenses.reduce((acc, expense) => acc + parseFloat(expense.cost || 0), 0);

    return (
        <>
            <Table striped bordered hover size="sm" className="mb-3">
                <thead>
                    <tr>
                        <th>Category</th>
                        <th>Description</th>
                        <th>Vendor</th>
                        <th>Cost</th>
                        <th>Date Entered</th>
                        <th>Paid On Date</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {expenses.map(expense => (
                        <tr key={expense.id}>
                            <td>{expense.category}</td>
                            <td>{expense.descriptionOfWork}</td>
                            <td>{expense.vendor}</td>
                            <td>${expense.cost}</td>
                            <td>{expense.dateEntered}</td>
                            <td>{expense.paidOnDate}</td>
                            <td>
                                <Button variant="primary" size="sm" onClick={() => handleEditExpense(expense)}>
                                    Edit
                                </Button>{' '}
                                <Button variant="danger" size="sm" onClick={() => handleDeleteExpense(expense.id)}>
                                    Delete
                                </Button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </Table>
            <div style={{ marginTop: '25px' }}>
                <Table>
                    <tbody>
                        <tr className="table-secondary">
                            <td style={{ fontWeight: 'bold', textAlign: 'left', width: '30%' }}>Total Expenses:</td>
                            <td style={{ textAlign: 'left', width: '55%' }}></td> {/* Empty cell for spacing */}
                            <td style={{ fontWeight: 'bold', textAlign: 'left', width: '60%' }}>${totalExpenses.toFixed(2)}</td>
                        </tr>
                    </tbody>
                </Table>
            </div>
        </>
    );
};

export default ExpenseList;

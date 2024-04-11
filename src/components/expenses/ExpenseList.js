import React, { useEffect, useState } from "react";
import { Card } from "react-bootstrap";
import { Button, Table } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import {
  fetchExpenses,
  deleteExpense,
  setCurrentExpense,
  showExpenseModal,
  fetchTruckDetails,
} from "../../store/slices/truckSlice";
import ExpenseForm from "./ExpenseForm"; // Make sure to import ExpenseForm

const ExpenseList = () => {
  const { id: truckId } = useParams();
  const dispatch = useDispatch();
  const expenses = useSelector((state) => state.truck.expenses);
  const isExpenseModalOpen = useSelector(
    (state) => state.truck.isExpenseModalOpen
  ); // Assuming you have this in your state

  useEffect(() => {
    dispatch(fetchExpenses(truckId));
    dispatch(fetchTruckDetails(truckId));
  }, [dispatch, truckId]);

  const handleEditExpense = (expense) => {
    dispatch(setCurrentExpense(expense));
    dispatch(showExpenseModal());
  };

  const handleDeleteExpense = (expenseId) => {
    dispatch(deleteExpense({ truckId: truckId, expenseId: expenseId }));
  };

  const handleAddExpense = () => {
    dispatch(setCurrentExpense(null)); // Clear current expense to signify adding a new one
    dispatch(showExpenseModal());
  };

  const totalExpenses = expenses.reduce((acc, expense) => {
    // Ensure expense and expense.cost are defined
    const expenseCost = expense?.cost ? parseFloat(expense.cost) : 0;
    return acc + expenseCost;
  }, 0);

  return (
    <>
      <Button onClick={handleAddExpense}>Add Expense</Button>
      <ExpenseForm show={isExpenseModalOpen} />

      {/* Expenses Card */}
      <Card className="shadow mb-4">
        {" "}
        {/* Add bottom margin to separate the cards */}
        <Card.Header className="bg-transparent">
          <h4 className="text-center mb-2">Expenses</h4>{" "}
          {/* Reduced bottom margin */}
        </Card.Header>
        <Card.Body className="pt-0">
          {" "}
          {/* Reduce padding-top if needed */}
          <div className="table-responsive">
            <Table hover size="sm" className="mb-0 table-dark">
              {" "}
              {/* Removed bottom margin */}
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
                {expenses.map((expense) =>
                  expense ? (
                    <tr key={expense.id}>
                      <td>{expense.category}</td>
                      <td>{expense.descriptionOfWork}</td>
                      <td>{expense.vendor}</td>
                      <td>${expense.cost}</td>
                      <td>{expense.dateEntered}</td>
                      <td>{expense.paidOnDate}</td>
                      <td>
                        <Button
                          variant="primary"
                          size="sm"
                          onClick={() => handleEditExpense(expense)}
                        >
                          Edit
                        </Button>{" "}
                        <Button
                          variant="danger"
                          size="sm"
                          onClick={() => handleDeleteExpense(expense.id)}
                        >
                          Delete
                        </Button>
                      </td>
                    </tr>
                  ) : null
                )}
              </tbody>
            </Table>
          </div>
        </Card.Body>
      </Card>

      {/* Total Expenses Card */}
      <Card className="shadow">
        <Card.Body>
          <div className="table-responsive">
            <Table hover size="sm" className="mb-0 table-dark">
              {" "}
              {/* Removed bottom margin */}
              <tbody>
                <tr>
                  <td style={{ fontWeight: "bold", textAlign: "left" }}>
                    Total Expenses:
                  </td>
                  <td style={{ fontWeight: "bold", textAlign: "right" }}>
                    ${totalExpenses.toFixed(2)}
                  </td>
                </tr>
              </tbody>
            </Table>
          </div>
        </Card.Body>
      </Card>
    </>
  );
};

export default ExpenseList;

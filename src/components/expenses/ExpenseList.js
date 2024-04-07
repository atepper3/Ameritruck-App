import React, { useEffect, useState } from "react";
import { Button, Table } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import {
  fetchExpenses,
  deleteExpense,
  setCurrentExpense,
  showExpenseModal,
} from "../../store/actions/truckActions";
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
  }, [dispatch, truckId]);

  const handleEditExpense = (expense) => {
    dispatch(setCurrentExpense(expense));
    dispatch(showExpenseModal());
  };

  const handleDeleteExpense = (expenseId) => {
    dispatch(deleteExpense(truckId, expenseId));
  };

  const handleAddExpense = () => {
    dispatch(setCurrentExpense(null)); // Clear current expense to signify adding a new one
    dispatch(showExpenseModal());
  };

  const totalExpenses = expenses.reduce(
    (acc, expense) => acc + parseFloat(expense.cost || 0),
    0
  );

  return (
    <>
      <Button onClick={handleAddExpense}>Add Expense</Button>
      <ExpenseForm show={isExpenseModalOpen} />
      <Table striped bordered hover size="sm" className="mb-3 table-dark">
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
          {expenses.map((expense) => (
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
          ))}
        </tbody>
      </Table>
      <div style={{ marginTop: "25px" }}>
        <Table variant="dark">
          {" "}
          {/* Use the 'variant' prop to ensure dark theme */}
          <tbody>
            <tr>
              <td
                style={{ fontWeight: "bold", textAlign: "left", width: "70%" }}
              >
                Total Expenses:
              </td>
              <td
                style={{ fontWeight: "bold", textAlign: "right", width: "30%" }}
              >
                ${totalExpenses.toFixed(2)}
              </td>
            </tr>
          </tbody>
        </Table>
      </div>
    </>
  );
};

export default ExpenseList;

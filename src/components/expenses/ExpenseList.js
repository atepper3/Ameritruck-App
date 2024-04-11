import React, { useEffect } from "react";
import { Card } from "react-bootstrap";
import { Button, Table } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import {
  fetchExpenses,
  deleteExpense,
  setCurrentExpense,
  showExpenseModal,
} from "../../store/slices/expenseSlice";
import ExpenseForm from "./ExpenseForm"; // Make sure to import ExpenseForm

const ExpenseList = () => {
  const { id: truckId } = useParams();
  const dispatch = useDispatch();
  // Correcting the useSelector to match the expenseSlice state structure
  const expense = useSelector((state) => state.expense.items);
  const isExpenseModalOpen = useSelector(
    (state) => state.expense.isExpenseModalOpen
  );

  useEffect(() => {
    dispatch(fetchExpenses(truckId));
  }, [dispatch, truckId]);

  const handleEditExpense = (expense) => {
    dispatch(setCurrentExpense(expense));
    dispatch(showExpenseModal());
  };

  const handleDeleteExpense = (expenseId) => {
    dispatch(deleteExpense({ truckId, expenseId }));
  };

  const handleAddExpense = () => {
    dispatch(setCurrentExpense(null)); // Prepare for adding a new expense
    dispatch(showExpenseModal());
  };

  // Calculate total expenses dynamically based on fetched expenses
  const totalExpenses = expense.reduce(
    (acc, expense) => acc + Number(expense.cost || 0),
    0
  );

  if (!expense) return <div>Loading...</div>;

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
                {expense.map((expense) =>
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

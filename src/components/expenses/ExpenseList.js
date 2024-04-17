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
  fetchTotalExpenses,
} from "../../store/slices/expenseSlice";
import { fetchTruckDetails } from "../../store/slices/truckSlice";
import ExpenseForm from "./ExpenseForm"; // Make sure to import ExpenseForm

const ExpenseList = () => {
  const { id: truckId } = useParams();
  const dispatch = useDispatch();

  useEffect(() => {
    if (truckId) {
      dispatch(fetchTruckDetails(truckId)); // Fetch truck details
      dispatch(fetchExpenses(truckId)); // Fetch expenses
      dispatch(fetchTotalExpenses(truckId)); // Fetch total expenses
    }
  }, [dispatch, truckId]);

  const truckInfo = useSelector((state) => state.truck.truckInfo);
  const expense = useSelector((state) => state.expense.items);
  const totalsByCategory = useSelector(
    (state) => state.expense.totalsByCategory
  );
  const totalExpenses = useSelector((state) => state.expense.totalExpenses);
  const isExpenseModalOpen = useSelector(
    (state) => state.expense.isExpenseModalOpen
  );
  const loading = useSelector(
    (state) => state.expense.loading || state.truck.loading
  );

  if (loading) {
    return <p>Loading...</p>;
  }

  if (!truckInfo) {
    return <p>Truck information not available.</p>; // Display message if truck info is not loaded
  }

  // Handler functions
  const handleEditExpense = (expense) => {
    dispatch(setCurrentExpense(expense));
    dispatch(showExpenseModal());
  };

  const handleDeleteExpense = (expenseId) => {
    dispatch(deleteExpense({ truckId, expenseId }));
  };

  const handleAddExpense = () => {
    dispatch(setCurrentExpense(null));
    dispatch(showExpenseModal());
  };

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
              <tbody>
                {/* Render a row for each category that has expenses */}
                {Object.entries(totalsByCategory).map(
                  ([category, total]) =>
                    total > 0 && (
                      <tr key={category}>
                        <td style={{ fontWeight: "bold", textAlign: "left" }}>
                          Total {category}:
                        </td>
                        <td style={{ fontWeight: "bold", textAlign: "right" }}>
                          ${total.toFixed(2)}
                        </td>
                      </tr>
                    )
                )}
                {/* Total expenses row */}
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

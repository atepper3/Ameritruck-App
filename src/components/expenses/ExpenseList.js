import React, { useEffect } from "react";
import { Card, Button, Table } from "react-bootstrap";
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
import ExpenseForm from "./ExpenseForm"; // Ensure ExpenseForm is correctly imported

const ExpenseList = () => {
  const { id: truckId } = useParams();
  const dispatch = useDispatch();

  const truckInfo = useSelector((state) => state.truck.truckInfo);
  const expenses = useSelector((state) => state.expense.items);

  const totalExpenses = useSelector((state) => state.expense.totalExpenses);
  const isExpenseModalOpen = useSelector(
    (state) => state.expense.isExpenseModalOpen,
  );
  const loading = useSelector(
    (state) => state.expense.loading || state.truck.loading,
  );

  useEffect(() => {
    if (truckId) {
      dispatch(fetchTruckDetails(truckId)); // Fetch truck details
      dispatch(fetchExpenses(truckId)); // This fetches expenses and initializes/updates total expenses
      dispatch(fetchTotalExpenses(truckId)); // Fetch total expenses (this is a separate API call to get the total expenses for the truck
    }
  }, [dispatch, truckId]);

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

  const handleDeleteExpense = (expenseId, cost) => {
    dispatch(deleteExpense({ truckId, expenseId, expenseCost: cost }));
  };

  const handleAddExpense = () => {
    dispatch(setCurrentExpense(null));
    dispatch(showExpenseModal());
  };

  return (
    <>
      <Button onClick={handleAddExpense}>Add Expense</Button>
      <ExpenseForm show={isExpenseModalOpen} />

      <Card className="shadow mb-4">
        <Card.Header className="bg-transparent">
          <h4 className="text-center mb-2">Expenses</h4>
        </Card.Header>
        <Card.Body className="pt-0">
          <div className="table-responsive">
            <Table hover size="sm" className="mb-0 table-dark">
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
                    <td>${expense.cost.toFixed(2)}</td>
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
                        onClick={() =>
                          handleDeleteExpense(expense.id, expense.cost)
                        }
                      >
                        Delete
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>
          </div>
        </Card.Body>
      </Card>

      <Card className="shadow">
        <Card.Body>
          <div className="table-responsive">
            <Table hover size="sm" className="mb-0 table-dark">
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

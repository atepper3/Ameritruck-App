import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Modal, Form, Button } from "react-bootstrap";
import {
  addExpense,
  updateExpense,
  hideExpenseModal,
  fetchTotalExpenses,
} from "../../store/slices/expenseSlice";

// Initial form state for resetting
const initialFormState = {
  category: "",
  descriptionOfWork: "",
  vendor: "",
  cost: "",
  dateEntered: "",
  paidOnDate: "",
};

const ExpenseForm = ({ truckId }) => {
  const dispatch = useDispatch();
  const { currentExpense, isExpenseModalOpen } = useSelector(
    (state) => state.expense,
  );
  const truckInfo = useSelector((state) => state.truck.truckInfo);
  const [formState, setFormState] = useState(initialFormState);

  // Populate form when editing an expense
  useEffect(() => {
    if (currentExpense) {
      setFormState(currentExpense);
    } else {
      setFormState(initialFormState); // Reset form when adding a new expense
    }
  }, [currentExpense, isExpenseModalOpen]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormState((prevState) => ({ ...prevState, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formattedData = {
      ...formState,
      cost: formState.cost.trim() === "" ? 0 : Number(formState.cost), // Convert cost to number, default to 0 if empty
    };

    if (isNaN(formattedData.cost)) {
      alert("Invalid cost value. Please enter a valid number.");
      return; // Prevent dispatching if cost is NaN
    }

    try {
      if (currentExpense) {
        await dispatch(
          updateExpense({
            truckId: truckInfo.id,
            expenseId: currentExpense.id,
            expenseData: formattedData,
            previousCost: currentExpense.cost, // Ensure this value is correctly passed
          }),
        )
          .unwrap()
          .then(() => dispatch(fetchTotalExpenses(truckId))); // Optionally refresh total expenses
      } else {
        await dispatch(
          addExpense({
            truckId: truckInfo.id,
            expenseData: formattedData,
          }),
        )
          .unwrap()
          .then(() => dispatch(fetchTotalExpenses(truckId))); // Optionally refresh total expenses
      }
      closeModal(); // Close modal after successful action completion
    } catch (error) {
      console.error("Failed to submit expense data:", error);
      alert("Failed to update the expense. Please try again.");
    }
  };

  // Close modal and reset form state
  const closeModal = () => {
    dispatch(hideExpenseModal());
    setFormState(initialFormState);
  };

  return (
    <Modal show={isExpenseModalOpen} onHide={closeModal}>
      <Modal.Header closeButton className="modal-dark">
        <Modal.Title>
          {currentExpense ? "Edit Expense" : "Add Expense"}
        </Modal.Title>
      </Modal.Header>
      <Modal.Body className="modal-dark">
        <Form onSubmit={handleSubmit}>
          <Form.Group className="mb-3">
            <Form.Label>Category</Form.Label>
            <Form.Control
              as="select"
              name="category"
              value={formState.category}
              onChange={handleChange}
              required
            >
              <option value="">Select Category</option>
              <option value="Batteries">Batteries</option>
              <option value="Detail">Detail</option>
              <option value="DOT">DOT</option>
              <option value="Extended Warranty">Extended Warranty</option>
              <option value="Freight/Towing">Freight/Towing</option>
              <option value="Inspection Fee">Inspection Fee</option>
              <option value="Paint / Body Work">Paint / Body Work</option>
              <option value="Referral Fee">Referral Fee</option>
              <option value="Repairs">Repairs</option>
              <option value="Tires">Tires</option>
              <option value="Title">Title</option>
              <option value="Wheels">Wheels</option>
              <option value="Cost Adjustment">Cost Adjustment</option>
              <option value="Lot Fee">Lot Fee</option>
              <option value="Trade O/A">Trade O/A</option>
              <option value="Write Down">Write Down</option>
            </Form.Control>
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Description of Work</Form.Label>
            <Form.Control
              type="text"
              name="descriptionOfWork"
              value={formState.descriptionOfWork}
              onChange={handleChange}
              required
            />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Vendor</Form.Label>
            <Form.Control
              type="text"
              name="vendor"
              value={formState.vendor}
              onChange={handleChange}
              required
            />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Cost</Form.Label>
            <Form.Control
              type="number"
              name="cost"
              value={formState.cost}
              onChange={handleChange}
              required
            />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Date Entered</Form.Label>
            <Form.Control
              type="date"
              name="dateEntered"
              value={formState.dateEntered}
              onChange={handleChange}
              required
            />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Paid On Date</Form.Label>
            <Form.Control
              type="date"
              name="paidOnDate"
              value={formState.paidOnDate}
              onChange={handleChange}
            />
          </Form.Group>
          <Button variant="secondary" onClick={closeModal} className="me-2">
            Cancel
          </Button>
          <Button variant="primary" type="submit">
            {currentExpense ? "Update Expense" : "Add Expense"}
          </Button>
        </Form>
      </Modal.Body>
    </Modal>
  );
};

export default ExpenseForm;

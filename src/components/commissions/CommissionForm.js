import React, { useState, useEffect } from "react";
import { Modal, Form, Button } from "react-bootstrap";
import { useDispatch } from "react-redux";
import {
  addCommission,
  updateCommission,
} from "../../store/slices/commissionSlice";

const initialFormState = {
  name: "",
  category: "", // New field for categorizing commissions
  type: "",
  amount: "",
};

const CommissionForm = ({
  show,
  handleClose,
  commissionData,
  truckId,
  onSubmit,
}) => {
  const [commission, setCommission] = useState(initialFormState);
  const [isPercentageType, setIsPercentageType] = useState(false);
  const dispatch = useDispatch();

  useEffect(() => {
    setCommission(commissionData || initialFormState);
    setIsPercentageType(commissionData?.type.includes("%") || false);
  }, [commissionData, show]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    const parsedValue = name === "amount" ? parseFloat(value) : value;
    setCommission((prev) => ({ ...prev, [name]: parsedValue }));
    if (name === "type") {
      setIsPercentageType(value.includes("%"));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // Create submission data with amount set to null if it's a percentage type
    const submissionData = {
      ...commission,
      amount: isPercentageType ? null : commission.amount,
    };

    console.log("Submitting commission:", submissionData);

    // Pass the adjusted commission data to the parent's onSubmit function
    onSubmit(submissionData); // This should now correctly handle the data with amount as null for percentage types

    handleClose(); // Close the modal
    setCommission(initialFormState); // Reset form upon submission
    setIsPercentageType(false); // Reset percentage type state
  };

  return (
    <Modal
      show={show}
      onHide={() => {
        handleClose();
        setCommission(initialFormState); // Ensure form is reset when closing
        setIsPercentageType(false);
      }}
      centered
    >
      <Modal.Header closeButton>
        <Modal.Title>
          {commissionData?.id ? "Edit Commission" : "Add Commission"}
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form onSubmit={handleSubmit}>
          <Form.Group className="mb-3">
            <Form.Label>Name</Form.Label>
            <Form.Control
              type="text"
              name="name"
              value={commission.name}
              onChange={handleChange}
              required
            />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Category</Form.Label>
            <Form.Select
              name="category"
              value={commission.category}
              onChange={handleChange}
              required
            >
              <option value="">Select Category</option>
              <option value="Buyer">Buyer</option>
              <option value="Seller">Seller</option>
            </Form.Select>
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Type</Form.Label>
            <Form.Select
              name="type"
              value={commission.type}
              onChange={handleChange}
              required
            >
              <option value="">Select Type</option>
              <option value="Flat">Flat</option>
              <option value="10%">10%</option>
              <option value="15%">15%</option>
            </Form.Select>
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Amount</Form.Label>
            <Form.Control
              type="number"
              name="amount"
              value={commission.amount}
              onChange={handleChange}
              required={!isPercentageType} // Only required if not percentage
              disabled={isPercentageType} // Disable if it's a percentage type
            />
          </Form.Group>
          <div className="text-end">
            <Button
              variant="secondary"
              onClick={() => {
                handleClose();
                setCommission(initialFormState); // Ensure form is reset when closing
                setIsPercentageType(false);
              }}
              className="me-2"
            >
              Cancel
            </Button>
            <Button variant="primary" type="submit">
              {commissionData?.id ? "Update" : "Add"} Commission
            </Button>
          </div>
        </Form>
      </Modal.Body>
    </Modal>
  );
};

export default CommissionForm;

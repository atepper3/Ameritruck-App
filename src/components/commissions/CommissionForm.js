import React, { useState, useEffect } from "react";
import { Modal, Form, Button } from "react-bootstrap";
import { useDispatch } from "react-redux";
import { addCommission, updateCommission } from "../../store/slices/truckSlice";

const initialFormState = {
  type: "",
  name: "",
  amount: "",
};

const CommissionForm = ({ show, handleClose, commissionData, truckId }) => {
  const [commission, setCommission] = useState(initialFormState);
  const [isPercentageType, setIsPercentageType] = useState(false);
  const dispatch = useDispatch();

  useEffect(() => {
    setCommission(commissionData || initialFormState);
    setIsPercentageType(commissionData?.type.includes("%") || false);
  }, [commissionData, show]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setCommission((prev) => ({ ...prev, [name]: value }));
    if (name === "type") {
      setIsPercentageType(value.includes("%"));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (commissionData?.id) {
      dispatch(updateCommission(truckId, commissionData.id, commission));
    } else {
      dispatch(addCommission(truckId, commission));
    }
    handleClose();
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
            <Form.Label>Type</Form.Label>
            <Form.Select
              name="type"
              value={commission.type}
              onChange={handleChange}
              required
            >
              <option value="">Select Type</option>
              <option value="Buyer Flat Rate">Buyer Flat Rate</option>
              <option value="Buyer %">Buyer %</option>
              <option value="Seller Flat Rate">Seller Flat Rate</option>
              <option value="Seller %">Seller %</option>
            </Form.Select>
          </Form.Group>
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
            <Form.Label>Amount</Form.Label>
            <Form.Control
              type="number"
              name="amount"
              value={commission.amount}
              onChange={handleChange}
              required
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

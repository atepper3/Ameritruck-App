import React, { useState, useEffect } from 'react';
import { Modal, Form, Button } from 'react-bootstrap';
import { db } from '../firebase';
import { doc, addDoc, updateDoc, collection } from 'firebase/firestore';

const ExpenseForm = ({ show, handleClose, expense, truckId, updateExpenses }) => {
  const [formState, setFormState] = useState({
    category: '',
    descriptionOfWork: '',
    vendor: '',
    cost: '',
    dateEntered: '',
    paidOnDate: '',
  });

  useEffect(() => {
    if (expense) {
      setFormState(expense);
    } else {
      setFormState({
        category: '',
        descriptionOfWork: '',
        vendor: '',
        cost: '',
        dateEntered: '',
        paidOnDate: '',
      });
    }
  }, [expense]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormState(prevState => ({ ...prevState, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (expense) {
        await updateDoc(doc(db, 'trucks', truckId, 'expenses', expense.id), formState);
      } else {
        await addDoc(collection(db, 'trucks', truckId, 'expenses'), formState);
      }
      handleClose();
    } catch (error) {
      console.error('Error saving expense:', error);
      alert('Failed to save expense.');
    }
  };

  return (
    <Modal show={show} onHide={handleClose}>
      <Modal.Header closeButton>
        <Modal.Title>{expense ? 'Edit Expense' : 'Add Expense'}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
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
          <Button variant="primary" type="submit">
            {expense ? 'Update Expense' : 'Add Expense'}
          </Button>
        </Form>
      </Modal.Body>
    </Modal>
  );
};

export default ExpenseForm;

import React, { useState, useEffect } from 'react';
import { Modal, Form, Button } from 'react-bootstrap';
import { db } from '../firebase';
import { doc, addDoc, updateDoc, collection } from 'firebase/firestore';

const CommissionForm = ({ show, handleClose, handleCommissionSubmit, commissionData, truckId }) => {
    const [commission, setCommission] = useState({
        type: '',
        name: '',
        amount: '',
    });
    const [isPercentageType, setIsPercentageType] = useState(false);

    // Function to reset the form
    const resetForm = () => {
        setCommission({ type: '', name: '', amount: '' });
        setIsPercentageType(false); // Resets this as well
    };

    // useEffect to reset the form when the modal is shown and there's no commissionData
    useEffect(() => {
        if (show && !commissionData) {
            resetForm();
        }
    }, [show, commissionData]);

    // useEffect to adjust for commission type and set the form for editing
    useEffect(() => {
        if (commissionData) {
            setCommission(commissionData);
            setIsPercentageType(commissionData.type.includes('%'));
        }
    }, [commissionData]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setCommission(prev => ({
            ...prev,
            [name]: value,
        }));
        if (name === "type") {
            setIsPercentageType(value.includes('%'));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const action = commissionData
                ? updateDoc(doc(db, 'trucks', truckId, 'commissions', commissionData.id), commission)
                : addDoc(collection(db, 'trucks', truckId, 'commissions'), commission);
            await action;
            handleClose();
            if (handleCommissionSubmit) handleCommissionSubmit();
        } catch (error) {
            console.error('Error adding/updating commission: ', error);
            alert('Failed to add/update commission.');
        }
    };


    return (
        <Modal show={show} onHide={handleClose} centered dialogClassName="modal-dark">
            <Modal.Header closeButton className="modal-dark-header">
                <Modal.Title>{commissionData ? 'Edit Commission' : 'Add Commission'}</Modal.Title>
            </Modal.Header>
            <Modal.Body className="modal-dark-body">
                <Form onSubmit={handleSubmit}>
                    <Form.Group>
                        <Form.Label>Type</Form.Label>
                        <Form.Control as="select" name="type" value={commission.type} onChange={handleChange} required>
                            <option value="">Select Type</option>
                            <option value="Buyer Flat Rate">Buyer Flat Rate</option>
                            <option value="Buyer %">Buyer %</option>
                            <option value="Seller Flat Rate">Seller Flat Rate</option>
                            <option value="Seller %">Seller %</option>
                        </Form.Control>
                    </Form.Group>
                    <Form.Group>
                        <Form.Label>Name</Form.Label>
                        <Form.Control type="text" name="name" value={commission.name} onChange={handleChange} required />
                    </Form.Group>
                    <Form.Group>
                        <Form.Label>Amount</Form.Label>
                        {isPercentageType ? (
                            <Form.Control as="select" name="amount" value={commission.amount} onChange={handleChange} required>
                                <option value="10">10%</option>
                                <option value="15">15%</option>
                            </Form.Control>
                        ) : (
                            <Form.Control type="number" name="amount" value={commission.amount} onChange={handleChange} required />
                        )}
                    </Form.Group>
                    <div className="text-end mt-4">
                        <Button variant="secondary" onClick={handleClose} className="me-2">Cancel</Button>
                        <Button variant="primary" type="submit">{commissionData ? 'Update' : 'Add'} Commission</Button>
                    </div>
                </Form>
            </Modal.Body>
        </Modal>
    );
};

export default CommissionForm;

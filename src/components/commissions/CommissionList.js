import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import { fetchCommissions, deleteCommission } from '../../store/actions/truckActions';
import { Button, Table, Modal } from 'react-bootstrap';
import CommissionForm from './CommissionForm';

const CommissionList = () => {
    const { id: truckId } = useParams(); // Use useParams to get the truckId
    const dispatch = useDispatch();
    const commissions = useSelector(state => state.truck.commissions);
    const [showCommissionForm, setShowCommissionForm] = useState(false);
    const [currentCommission, setCurrentCommission] = useState(null); // New state for current commission

    useEffect(() => {
        dispatch(fetchCommissions(truckId));
    }, [dispatch, truckId]);

    const handleAddCommission = () => {
        setCurrentCommission(null); // No current commission when adding
        setShowCommissionForm(true);
    };

    const handleEditCommission = (commission) => {
        setCurrentCommission(commission); // Set current commission for editing
        setShowCommissionForm(true);
    };

    const handleDeleteCommission = (commissionId) => {
        dispatch(deleteCommission(truckId, commissionId));
    };

    // Modify the commission submit handler if necessary
    const handleCommissionSubmit = (commissionData) => {
        // Logic after submitting the commission, e.g., refreshing the list
        dispatch(fetchCommissions(truckId));
        setShowCommissionForm(false); // Close the form upon submission
    };

    const handleClose = () => {
        setShowCommissionForm(false);
        setCurrentCommission(null); // Reset current commission on close
    };

    return (
        <div>
            <Button variant="primary" onClick={handleAddCommission}>Add Commission</Button>
            {/* CommissionForm modal invoked here with correct handleClose prop */}
            {showCommissionForm && (
                <CommissionForm 
                    show={showCommissionForm}
                    handleClose={handleClose}
                    commissionData={currentCommission}
                    truckId={truckId}
                />
            )}

            {['Buyer Commissions', 'Seller Commissions'].map((title, index) => {
                const isBuyer = index === 0;
                const filteredCommissions = commissions.filter(commission => 
                    isBuyer ? commission.type.includes('Buyer') : commission.type.includes('Seller'));

                return (
                    <div key={title}>
                        <h2 className="text-light">{title}</h2>
                        <Table striped bordered hover variant="dark" size="sm">
                            <thead>
                                <tr>
                                    <th>Type</th>
                                    <th>Name</th>
                                    <th>Amount</th>
                                    <th>Action</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredCommissions.map((commission) => (
                                    <tr key={commission.id}>
                                        <td>{commission.type}</td>
                                        <td>{commission.name}</td>
                                        <td>${commission.amount}</td>
                                        <td>
                                            <Button variant="secondary" size="sm" onClick={() => handleEditCommission(commission)}>
                                                Edit
                                            </Button>{' '}
                                            <Button variant="danger" size="sm" onClick={() => handleDeleteCommission(commission.id)}>
                                                Delete
                                            </Button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </Table>
                    </div>
                );
            })}
        </div>
    );
};

export default CommissionList;

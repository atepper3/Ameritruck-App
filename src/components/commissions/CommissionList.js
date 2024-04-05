import React, { useEffect, useState } from 'react';
import { db } from '../../firebase';
import { collection, query, onSnapshot, deleteDoc, doc } from 'firebase/firestore';
import { Button, Table, Modal } from 'react-bootstrap';
import CommissionForm from './CommissionForm';

const CommissionList = ({ truckId, handleCommissionSubmit }) => {
    const [commissions, setCommissions] = useState([]);
    const [showCommissionForm, setShowCommissionForm] = useState(false);

    useEffect(() => {
        if (truckId) {
            const q = query(collection(db, "trucks", truckId, "commissions"));
            const unsubscribe = onSnapshot(q, (snapshot) => {
                const commissionsData = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
                setCommissions(commissionsData);
            });

            return () => unsubscribe();
        }
    }, [truckId]);

    const deleteCommission = async (commissionId) => {
        try {
            await deleteDoc(doc(db, "trucks", truckId, "commissions", commissionId));
            alert('Commission successfully deleted!');
        } catch (error) {
            console.error("Error deleting commission: ", error);
            alert('Failed to delete commission.');
        }
    };

    return (
        <div>
            <Button variant="primary" onClick={() => setShowCommissionForm(true)}>Add Commission</Button>
                <Modal.Body>
                    <CommissionForm 
                        show={showCommissionForm}
                        handleClose={() => setShowCommissionForm(false)} 
                        handleCommissionSubmit={(commissionData) => {
                            handleCommissionSubmit(commissionData);
                            setShowCommissionForm(false); // Close modal on submit
                        }}
                        truckId={truckId} />
                </Modal.Body>

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
                                            <Button variant="danger" size="sm" onClick={() => deleteCommission(commission.id)}>
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

import React, { useEffect, useState } from 'react';
import { db } from '../firebase';
import { collection, query, onSnapshot, deleteDoc, doc } from 'firebase/firestore';
import Table from 'react-bootstrap/Table';

const CommissionList = ({ truckId }) => {
    // State definitions
    const [commissions, setCommissions] = useState([]);

    // useEffect for fetching commissions
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

    // Filtering logic for commissions
    const buyerCommissions = commissions.filter(commission =>
        commission.type === "Buyer Flat Rate" || commission.type === "Buyer %");
    const sellerCommissions = commissions.filter(commission =>
        commission.type === "Seller Flat Rate" || commission.type === "Seller %");

    // deleteCommission function definition
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
            {/* Buyer Commissions Table */}
            <h2>Buyer Commissions</h2>
            <Table striped bordered hover>
                <thead>
                    <tr>
                        <th>Type</th>
                        <th>Name</th>
                        <th>Amount</th>
                        <th>Action</th> {/* Add a column for actions */}
                    </tr>
                </thead>
                <tbody>
                    {buyerCommissions.map((commission) => (
                        <tr key={commission.id}>
                            <td>{commission.type}</td>
                            <td>{commission.name}</td>
                            <td>{commission.amount}</td>
                            <td>
                                <button onClick={() => deleteCommission(commission.id)}>Delete</button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </Table>

            {/* Seller Commissions Table */}
            <h2>Seller Commissions</h2>
            <Table striped bordered hover>
                <thead>
                    <tr>
                        <th>Type</th>
                        <th>Name</th>
                        <th>Amount</th>
                        <th>Action</th> {/* Add a column for actions */}
                    </tr>
                </thead>
                <tbody>
                    {sellerCommissions.map((commission) => (
                        <tr key={commission.id}>
                            <td>{commission.type}</td>
                            <td>{commission.name}</td>
                            <td>{commission.amount}</td>
                            <td>
                                <button onClick={() => deleteCommission(commission.id)}>Delete</button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </Table>
        </div>
    );
};

export default CommissionList;

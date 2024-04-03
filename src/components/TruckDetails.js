import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { db } from '../firebase';
import { doc, getDoc, updateDoc, collection, addDoc, onSnapshot } from 'firebase/firestore';
import { Tabs, Tab, Button, Modal } from 'react-bootstrap';
import ExpenseForm from './ExpenseForm';
import ExpenseList from './ExpenseList';
import CommissionList from './CommissionList';
import CommissionCalculator from './CommissionCalculator';
import TruckInfo from './TruckInfo'; 
import '../styles/Custom-styles.css';

const TruckDetails = () => {
    const { id } = useParams();
    const [truck, setTruck] = useState(null);
    const [commissions, setCommissions] = useState([]);
    const [editable, setEditable] = useState(false);
    const [key, setKey] = useState('details');
    const [expenses, setExpenses] = useState([]);
    const [showCommissionForm, setShowCommissionForm] = useState(false);
    const [selectedExpense, setSelectedExpense] = useState(null);
    const [showExpenseModal, setShowExpenseModal] = useState(false);

    const updateExpenses = (newExpense, expenseId = null) => {
        if (expenseId) {
            // Updating an existing expense
            setExpenses(currentExpenses =>
                currentExpenses.map(expense =>
                    expense.id === expenseId ? { ...expense, ...newExpense } : expense
                )
            );
        } else {
            // Adding a new expense
            setExpenses(currentExpenses => [...currentExpenses, newExpense]);
        }
    };

    useEffect(() => {
        const fetchTruckInfo = async () => {
            const docRef = doc(db, 'trucks', id);
            const docSnap = await getDoc(docRef);
            if (docSnap.exists()) {
                console.log("Fetched truck info:", docSnap.data()); // This helps verify what you're getting.
                setTruck(docSnap.data()); // Assuming this sets all the info correctly.
            } else {
                console.error("No truck information found!");
            }
        };
    
        fetchTruckInfo();
        
        const unsubscribeCommissions = onSnapshot(collection(db, 'trucks', id, 'commissions'), 
            snapshot => setCommissions(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }))));
        const unsubscribeExpenses = onSnapshot(collection(db, 'trucks', id, 'expenses'), 
            snapshot => setExpenses(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }))));
        return () => {
            unsubscribeCommissions();
            unsubscribeExpenses();
        };
    }, [id]);

    // Correctly defined handler functions within the component
    const handleEditToggle = () => setEditable(!editable);
    const handleChange = e => {
        const { name, value, type, checked } = e.target;
        setTruck(prev => ({ ...prev, [name]: type === 'checkbox' ? checked : value }));
    };

    const handleSubmit = async e => {
        e.preventDefault();
        try {
            await updateDoc(doc(db, 'trucks', id), truck);
            alert('Truck updated successfully!');
            setEditable(false);
        } catch (error) {
            console.error('Error updating truck: ', error);
            alert('Failed to update truck.');
        }
    };

    const handleCommissionSubmit = async (commissionData) => {
        try {
            commissionData.truckId = id; // Include the truckId with the commission data
            await addDoc(collection(db, 'trucks', id, 'commissions'), commissionData);
            setShowCommissionForm(false); // Close the form modal after successful submission
            // Optionally, show a success message to the user
        } catch (error) {
            console.error('Error adding commission:', error);
            // Optionally, handle errors, e.g., show an error message
        }
    };

    const sellerCommissions = commissions.filter(c => c.type.startsWith('Seller'));
    const buyerCommissions = commissions.filter(c => c.type.startsWith('Buyer'));

    if (!truck) {
        return <div>Loading truck details...</div>;
      }

    return (
        <div className="container mt-2">
            <Tabs defaultActiveKey="truckInfo" id="truck-details-tabs" className="mb-3">
                <Tab eventKey="truckInfo" title="Truck Info">
                    <TruckInfo />
                </Tab>
                <Tab eventKey="expenses" title="Expenses">
                    <div>
                        <Button variant="primary" onClick={() => {
                        setSelectedExpense(null); // Reset or set to null when adding a new expense
                        setShowExpenseModal(true);
                        }}>Add Expense</Button>
                        
                        {/* Adjusted ExpenseForm Modal Invocation */}
                        <ExpenseForm
                        show={showExpenseModal}
                        handleClose={() => setShowExpenseModal(false)}
                        expense={selectedExpense}
                        truckId={id}
                        updateExpenses={updateExpenses}
                        />
                        
                        {/* Make sure to pass down the needed props to ExpenseList */}
                        <ExpenseList
                        expenses={expenses}
                        truckId={id}
                        setExpenses={setExpenses}
                        setSelectedExpense={setSelectedExpense} 
                        setShowExpenseModal={setShowExpenseModal}
                        />
                    </div>
                    </Tab>
                <Tab eventKey="commissions" title="Commissions">
                    <CommissionList 
                        truckId={id} 
                        handleCommissionSubmit={handleCommissionSubmit}
                    />
                    <CommissionCalculator
                        key={commissions.length} // Ensures re-rendering when commissions change.
                        buyerCommissions={buyerCommissions}
                        sellerCommissions={sellerCommissions}
                        purchasePrice={truck.truckinfo.purchasePrice || 0}
                        soldPrice={truck.truckinfo.soldPrice || 0}
                        expenses={expenses}
                    />
                </Tab>
            </Tabs>
        </div>
    );
};

export default TruckDetails;
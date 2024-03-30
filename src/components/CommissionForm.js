import React, { useState, useEffect } from 'react';

const CommissionForm = ({ handleClose, handleCommissionSubmit }) => {
    const [commission, setCommission] = useState({
        type: '',
        name: '',
        amount: '',
    });
    const [isPercentageType, setIsPercentageType] = useState(false);

    useEffect(() => {
        // Update isPercentageType based on the commission type
        const isPercentage = commission.type.includes('%');
        setIsPercentageType(isPercentage);
        // Reset amount when changing between percentage and flat rate
        if (isPercentage) {
            setCommission(prev => ({ ...prev, amount: '10' })); // Default to 10% for percentages
        }
    }, [commission.type]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setCommission(prevCommission => ({
            ...prevCommission,
            [name]: value,
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await handleCommissionSubmit(commission);
            handleClose(); // Close the form upon successful submission
            setCommission({ type: '', name: '', amount: '' }); // Reset the form fields
        } catch (error) {
            console.error('Error adding commission: ', error);
            alert('Failed to add commission.');
        }
    };

    return (
        <div>
            <h2>Add Commission</h2>
            <form onSubmit={handleSubmit}>
                <div>
                    <label>Type</label>
                    <select name="type" value={commission.type} onChange={handleChange}>
                        <option value="">Select Type</option>
                        <option value="Buyer Flat Rate">Buyer Flat Rate</option>
                        <option value="Buyer %">Buyer %</option>
                        <option value="Seller Flat Rate">Seller Flat Rate</option>
                        <option value="Seller %">Seller %</option>
                    </select>
                </div>
                <div>
                    <label>Name</label>
                    <input type="text" name="name" value={commission.name} onChange={handleChange} />
                </div>
                <div>
                    <label>Amount</label>
                    {isPercentageType ? (
                        <select name="amount" value={commission.amount} onChange={handleChange}>
                            <option value="10">10%</option>
                            <option value="15">15%</option>
                        </select>
                    ) : (
                        <input type="number" name="amount" value={commission.amount} onChange={handleChange} />
                    )}
                </div>
                <button type="submit">Add Commission</button>
            </form>
        </div>
    );
};

export default CommissionForm;

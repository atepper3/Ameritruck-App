import React, { useState } from 'react';
import { db } from '../../firebase';
import { collection, addDoc } from 'firebase/firestore';
import { Button, Form, Container, Row, Col } from 'react-bootstrap';

const AddMultipleTrucksForm = () => {
    const [truckEntries, setTruckEntries] = useState(Array(5).fill(null).map(() => ({})));

    const handleAddTruck = () => {
        setTruckEntries([...truckEntries, {}]);
    };

    const handleChange = (index, key, value) => {
        const updatedEntries = [...truckEntries];
        // Keep the value as is without converting to boolean here
        updatedEntries[index][key] = value;
        setTruckEntries(updatedEntries);
    };     

    const handleSubmit = async (event) => {
        event.preventDefault();
        try {
            for (const entry of truckEntries) {
                if (Object.values(entry).some(value => value !== '')) {
                    await addDoc(collection(db, "trucks"), {
                        truckinfo: {
                            ...entry,
                            // truckHere is directly used without conversion
                        }
                    });
                }
            }
            alert("Trucks added successfully!");
            setTruckEntries(Array(5).fill(null).map(() => ({})));
        } catch (error) {
            console.error("Error adding trucks: ", error);
            alert("Failed to add trucks.");
        }
    };
    
    

    return (
        <Container>
            <Form onSubmit={handleSubmit}>
                <h3>Add Multiple Trucks</h3>
                <Row className="mb-3">
                    {[
                        { label: 'Stock Number', key: 'stockNumber' },
                        { label: 'Fleet Number', key: 'fleetNumber' },
                        { label: 'Status', key: 'status'},
                        { label: 'Sale Type', key: 'saleType'},
                        { label: 'Purchase Date', key: 'purchaseDate'},
                        { label: 'Purchased From', key: 'purchasedFrom'},
                        { label: 'Purchase Price', key: 'purchasePrice'},
                        { label: 'Buyer', key: 'buyer'},
                        { label: 'Year', key: 'year'},
                        { label: 'Make', key: 'make'},
                        { label: 'Model', key: 'model'},
                        { label: 'VIN/Serial', key: 'vinSerial'},
                        { label: 'Classification', key: 'classification'},
                        { label: 'Location', key: 'location'},
                        { label: 'Truck Here?', key: 'truckHere'},
                    ].map((field, index) => (
                        <Row key={index} className="align-items-center">
                            <Col xs={3}><Form.Label>{field.label}</Form.Label></Col>
                            {truckEntries.map((_, entryIndex) => (
                                <Col key={entryIndex}>
                                    {field.key === 'status' || field.key === 'truckHere' ? (
                                        <Form.Select
                                        aria-label={field.label}
                                        value={truckEntries[entryIndex][field.key] || ''}
                                        onChange={(e) => handleChange(entryIndex, field.key, e.target.value)}
                                    >
                                        <option value="">Select...</option>
                                        {field.key === 'status' && ['Active', 'Future', 'Pending', 'Sold'].map(option => (
                                            <option key={option} value={option}>{option}</option>
                                        ))}
                                        {field.key === 'truckHere' && ['Yes', 'No'].map(option => (
                                            <option key={option} value={option}>{option}</option>
                                        ))}
                                    </Form.Select>
                                    
                                    ) : (
                                        <Form.Control 
                                            type={field.key === 'purchaseDate' ? 'date' : 'text'}
                                            value={truckEntries[entryIndex][field.key] || ''}
                                            onChange={(e) => handleChange(entryIndex, field.key, e.target.value)} />
                                    )}
                                </Col>
                            ))}
                        </Row>
                    ))}
                </Row>
                <Button variant="primary" onClick={handleAddTruck} className="me-2">Add Another Truck</Button>
                <Button type="submit">Submit All Trucks</Button>
            </Form>
        </Container>
    );
};

export default AddMultipleTrucksForm;

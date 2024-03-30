import React, { useState } from 'react';
import { db } from '../firebase';
import { collection, addDoc } from 'firebase/firestore';
import { Button, Form, Container, Row, Col } from 'react-bootstrap';

const AddMultipleTrucksForm = () => {
    const [trucks, setTrucks] = useState([
        {
            stockNumber: '',
            fleetNumber: '',
            status: '',
            saleType: '',
            purchaseDate: '',
            purchasedFrom: '',
            purchasePrice: '',
            buyer: '',
            year: '',
            make: '',
            model: '',
            vinSerial: '',
            classification: '',
            location: '',
            truckHere: false
        }
    ]);

    const handleAddTruck = () => {
        setTrucks([...trucks, {
            stockNumber: '',
            fleetNumber: '',
            status: '',
            saleType: '',
            purchaseDate: '',
            purchasedFrom: '',
            purchasePrice: '',
            buyer: '',
            year: '',
            make: '',
            model: '',
            vinSerial: '',
            classification: '',
            location: '',
            truckHere: false
        }]);
    };

    const handleChange = (index, event) => {
        const { name, value } = event.target; // Removed type and checked as they're not needed for dropdown
        const newTrucks = [...trucks];
        newTrucks[index][name] = value; // Direct assignment of value without type check
        setTrucks(newTrucks);
    };    

    const handleSubmit = async (event) => {
        event.preventDefault();
        try {
            for (const truck of trucks) {
                await addDoc(collection(db, "trucks"), truck);
            }
            alert("Trucks added successfully!");
            setTrucks([{ 
                stockNumber: '',
                fleetNumber: '',
                status: '',
                saleType: '',
                purchaseDate: '',
                purchasedFrom: '',
                purchasePrice: '',
                buyer: '',
                year: '',
                make: '',
                model: '',
                vinSerial: '',
                classification: '',
                location: '',
                truckHere: false
            }]);
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
                    <Col>
                        <table className="table">
                            <thead>
                                <tr>
                                    <th>Stock Number</th>
                                    <th>Fleet Number</th>
                                    <th>Status</th>
                                    <th>Sale Type</th>
                                    <th>Purchase Date</th>
                                    <th>Purchased From</th>
                                    <th>Purchase Price</th>
                                    <th>Buyer</th>
                                    <th>Year</th>
                                    <th>Make</th>
                                    <th>Model</th>
                                    <th>VIN/Serial</th>
                                    <th>Classification</th>
                                    <th>Location</th>
                                    <th>Truck Here?</th>
                                </tr>
                            </thead>
                            <tbody>
                                {trucks.map((truck, index) => (
                                    <tr key={index}>
                                        <td><Form.Control type="text" name="stockNumber" value={truck.stockNumber} onChange={(e) => handleChange(index, e)} style={{ width: '150px' }} /></td>
                                        <td><Form.Control type="text" name="fleetNumber" value={truck.fleetNumber} onChange={(e) => handleChange(index, e)} style={{ width: '150px' }} /></td>
                                        <td><Form.Control as="select" name="status" value={truck.status} onChange={(e) => handleChange(index, e)} style={{ width: '150px' }}>
                                            <option value="">Select...</option>
                                            <option value="Active">Active</option>
                                            <option value="Future">Future</option>
                                            <option value="Pending">Pending</option>
                                            <option value="Sold">Sold</option>
                                        </Form.Control></td>
                                        <td><Form.Control type="text" name="saleType" value={truck.saleType} onChange={(e) => handleChange(index, e)} style={{ width: '150px' }} /></td>
                                        <td><Form.Control type="date" name="purchaseDate" value={truck.purchaseDate} onChange={(e) => handleChange(index, e)} style={{ width: '150px' }} /></td>
                                        <td><Form.Control type="text" name="purchasedFrom" value={truck.purchasedFrom} onChange={(e) => handleChange(index, e)} style={{ width: '150px' }} /></td>
                                        <td><Form.Control type="number" step="0.01" name="purchasePrice" value={truck.purchasePrice} onChange={(e) => handleChange(index, e)} style={{ width: '150px' }} /></td>
                                        <td><Form.Control type="text" name="buyer" value={truck.buyer} onChange={(e) => handleChange(index, e)} style={{ width: '150px' }} /></td>
                                        <td><Form.Control type="text" name="year" value={truck.year} onChange={(e) => handleChange(index, e)} style={{ width: '150px' }} /></td>
                                        <td><Form.Control type="text" name="make" value={truck.make} onChange={(e) => handleChange(index, e)} style={{ width: '150px' }} /></td>
                                        <td><Form.Control type="text" name="model" value={truck.model} onChange={(e) => handleChange(index, e)} style={{ width: '150px' }} /></td>
                                        <td><Form.Control type="text" name="vinSerial" value={truck.vinSerial} onChange={(e) => handleChange(index, e)} style={{ width: '150px' }} /></td>
                                        <td><Form.Control type="text" name="classification" value={truck.classification} onChange={(e) => handleChange(index, e)} style={{ width: '150px' }} /></td>
                                        <td><Form.Control type="text" name="location" value={truck.location} onChange={(e) => handleChange(index, e)} style={{ width: '150px' }} /></td>
                                        <td><Form.Control as="select" name="truckHere" value={truck.truckHere} onChange={(e) => handleChange(index, e)} style={{ width: '150px' }}>
                                            <option value="">Select...</option>
                                            <option value="Yes">Yes</option>
                                            <option value="No">No</option>
                                        </Form.Control></td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </Col>
                </Row>
                <Row>
                    <Col>
                        <Button variant="primary" onClick={handleAddTruck} className="me-2">Add Another Truck</Button>
                        <Button type="submit">Submit All Trucks</Button>
                    </Col>
                </Row>
            </Form>
        </Container>
    );
};

export default AddMultipleTrucksForm;

import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { db } from '../firebase';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { Button, Form, Container, Card, Row, Col } from 'react-bootstrap';
import { useTruck } from '../TruckContext';

const TruckInfo = () => {
    const { id } = useParams();
    const [truck, setTruck] = useState({});
    const [editable, setEditable] = useState(false);
    const { setTruckDetails } = useTruck(); // Use the method from context to update global state

    useEffect(() => {
        const fetchTruckInfo = async () => {
            const truckRef = doc(db, 'trucks', id);
            const truckSnap = await getDoc(truckRef);

            if (truckSnap.exists() && truckSnap.data().truckinfo) {
                const truckInfo = truckSnap.data().truckinfo;
                setTruck(truckInfo);
                // Correctly update the context with truck details
                setTruckDetails({
                    stockNumber: truckInfo.stockNumber,
                    year: truckInfo.year,
                    make: truckInfo.make,
                    model: truckInfo.model,
                });
            } else {
                console.log("No truck information found!");
            }
        };

        fetchTruckInfo();
    }, [id, setTruck, setTruckDetails]);
    

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setTruck(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value,
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await updateDoc(doc(db, 'trucks', id), { truckinfo: truck });
            alert('Truck information updated successfully!');
            setEditable(!editable);
        } catch (error) {
            console.error('Error updating truck: ', error);
            alert('Failed to update truck.');
        }
    };

    // Define categories and fields for better organization
// Define categories and fields for better organization
    const fieldGroups = [
        {
            title: "Truck Identification",
            fields: [
                { name: 'stockNumber', label: 'Stock Number', type: 'text' },
                { name: 'fleetNumber', label: 'Fleet Number', type: 'text' },
                { name: 'vinSerial', label: 'VIN', type: 'text' },
                { name: 'year', label: 'Year', type: 'text' },
                { name: 'make', label: 'Make', type: 'text' },
                { name: 'model', label: 'Model', type: 'text' },
                { name: 'classification', label: 'Classification', type: 'text' },
            ]
        },
        {
            title: "Purchase",
            fields: [
                { name: 'purchaseDate', label: 'Purchase Date', type: 'date' },
                { name: 'purchasedFrom', label: 'Purchased From', type: 'text' },
                { name: 'purchasePrice', label: 'Purchase Price', type: 'number' },
                { name: 'buyer', label: 'Buyer', type: 'text' },
                { name: 'location', label: 'Location', type: 'text' },
                { name: 'status', label: 'Status', type: 'select', options: ['Active', 'Future', 'Pending', 'Sold'] },
            ]
        },
        {
            title: "Sale Information",
            fields: [
                { name: 'customer', label: 'Customer', type: 'text' },
                { name: 'saleType', label: 'Sale Type', type: 'text' },
                { name: 'saleDate', label: 'Sale Date', type: 'date' },
                { name: 'soldPrice', label: 'Sold Price', type: 'number' },
                { name: 'salesman', label: 'Salesman', type: 'text' },
                { name: 'closeType', label: 'Close Type', type: 'text' },
                { name: 'fundedDate', label: 'Funded Date', type: 'date' },
                { name: 'fundingType', label: 'Funding Type', type: 'text' },
            ]
        },
        {
            title: "Additional Info",
            fields: [
                { name: 'truckHere', label: 'Truck Here?', type: 'select', options: ['Yes', 'No'] },
                { name: 'titleIn', label: 'Title In', type: 'select', options: ['Yes', 'No'] },
                { name: 'titleOut', label: 'Title Out', type: 'select', options: ['Yes', 'No'] },
                { name: 'titleNote', label: 'Title Note', type: 'textarea' },
                { name: 'titleOutNote', label: 'Title Out Note', type: 'textarea' },
                { name: 'comments', label: 'Comments', type: 'textarea' },
                { name: 'referralSource', label: 'Referral Source', type: 'text' },
            ]
        },
    ];


    return (
        <Container fluid className="mt-2">
            <Form onSubmit={handleSubmit} className="text-small">
                {/* First Row: Truck Identification and Purchase */}
                <Row xs={1} md={2} className="g-2 mb-2">
                    {fieldGroups.slice(0, 2).map((group, index) => (
                        <Col key={index}>
                            <Card className="h-100">
                                <Card.Header as="h6" className="small">{group.title}</Card.Header>
                                <Card.Body className="p-2">
                                    {group.fields.map((field, idx) => (
                                        <Form.Group as={Row} className="mb-1" key={idx}>
                                            <Form.Label column xs="5" className="small">{field.label}:</Form.Label>
                                            <Col xs="7">
                                                {field.type === 'select' ? (
                                                    <Form.Select 
                                                        size="sm"
                                                        name={field.name} 
                                                        value={truck[field.name] || ""} 
                                                        onChange={handleChange} 
                                                        className="small">
                                                        <option value="">Select...</option>
                                                        {field.options.map(option => (
                                                            <option key={option} value={option}>{option}</option>
                                                        ))}
                                                    </Form.Select>
                                                ) : (
                                                    <Form.Control 
                                                        size="sm"
                                                        type={field.type === 'textarea' ? undefined : field.type}
                                                        as={field.type === 'textarea' ? 'textarea' : undefined}
                                                        name={field.name} 
                                                        value={truck[field.name] || ""} 
                                                        onChange={handleChange}
                                                        rows={field.type === 'textarea' ? 2 : undefined} 
                                                        className="small"/>
                                                )}
                                            </Col>
                                        </Form.Group>
                                    ))}
                                </Card.Body>
                            </Card>
                        </Col>
                    ))}
                </Row>
                {/* Second Row: Sale Information and Additional Info */}
                <Row xs={1} md={2} className="g-2">
                    {fieldGroups.slice(2, 4).map((group, index) => (
                        <Col key={index + 2}>
                            <Card className="mb-3">
                                <Card.Header as="h6" className="small">{group.title}</Card.Header>
                                <Card.Body className="p-2">
                                    {group.fields.map((field, idx) => (
                                        <Form.Group as={Row} className="mb-1" key={idx}>
                                            <Form.Label column xs="5" className="small">{field.label}:</Form.Label>
                                            <Col xs="7">
                                                {field.type === 'select' ? (
                                                    <Form.Select 
                                                        size="sm"
                                                        name={field.name} 
                                                        value={truck[field.name] || ""} 
                                                        onChange={handleChange} 
                                                        className="small">
                                                        <option value="">Select...</option>
                                                        {field.options.map(option => (
                                                            <option key={option} value={option}>{option}</option>
                                                        ))}
                                                    </Form.Select>
                                                ) : (
                                                    <Form.Control 
                                                        size="sm"
                                                        type={field.type === 'textarea' ? undefined : field.type}
                                                        as={field.type === 'textarea' ? 'textarea' : undefined}
                                                        name={field.name} 
                                                        value={truck[field.name] || ""} 
                                                        onChange={handleChange}
                                                        rows={field.type === 'textarea' ? 2 : undefined} 
                                                        className="small"/>
                                                )}
                                            </Col>
                                        </Form.Group>
                                    ))}
                                </Card.Body>
                            </Card>
                        </Col>
                    ))}
                </Row>
                <div className="d-grid gap-2">
                    <Button variant="success" size="sm" className="mt-2">Save Changes</Button>
                </div>
            </Form>
        </Container>


    );
};

export default TruckInfo;

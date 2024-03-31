import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { db } from '../firebase';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { Button, Form, Container, Card, Table } from 'react-bootstrap';

const TruckInfo = () => {
    const { id } = useParams();
    const [truck, setTruck] = useState({});
    const [editable, setEditable] = useState(false);

    useEffect(() => {
        const fetchTruckInfo = async () => {
            const truckRef = doc(db, 'trucks', id);
            const truckSnap = await getDoc(truckRef);

            if (truckSnap.exists() && truckSnap.data().truckinfo) {
                setTruck(truckSnap.data().truckinfo);
            } else {
                console.log("No truck information found!");
            }
        };

        fetchTruckInfo();
    }, [id]);

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
        <Container className="mt-4">
          <Card className="shadow mb-4">
            <Card.Header className="d-flex justify-content-between align-items-center">
              <h5>Truck Information</h5>
              <Button onClick={() => setEditable(!editable)} variant={editable ? "danger" : "primary"}>
                {editable ? "Cancel Edit" : "Edit"}
              </Button>
            </Card.Header>
          </Card>
          {!editable ? (
            // Condensed view with tables side by side
            <div className="d-flex flex-wrap justify-content-between">
              {fieldGroups.map((group, index) => (
                <Card key={index} className="mb-4 flex-fill me-2" style={{ maxWidth: "24%" }}>
                  <Card.Header><h6>{group.title}</h6></Card.Header>
                  <Card.Body>
                    {group.fields.map((field, idx) => (
                      <div key={idx} className="mb-2">
                        <strong>{field.label}:</strong> {truck[field.name] || 'N/A'}
                      </div>
                    ))}
                  </Card.Body>
                </Card>
              ))}
            </div>
          ) : (
            // Editable view with full details
            <Form onSubmit={handleSubmit}>
              <div className="row">
                {fieldGroups.map((group, index) => (
                  <div className="col-md-6" key={index}>
                    <Card className="mb-4">
                      <Card.Header><h6>{group.title}</h6></Card.Header>
                      <Card.Body>
                        {group.fields.map((field, idx) => (
                          <Form.Group className="mb-3" key={idx}>
                            <Form.Label>{field.label}</Form.Label>
                            {field.type === 'select' ? (
                              <Form.Select name={field.name} value={truck[field.name] || ""} onChange={handleChange} disabled={!editable}>
                                <option value="">Select...</option>
                                {field.options.map(option => (
                                  <option key={option} value={option}>{option}</option>
                                ))}
                              </Form.Select>
                            ) : (
                              <Form.Control type={field.type} name={field.name} value={truck[field.name] || ""} onChange={handleChange} disabled={!editable} />
                            )}
                          </Form.Group>
                        ))}
                      </Card.Body>
                    </Card>
                  </div>
                ))}
              </div>
              <Button variant="success" type="submit">
                Save Changes
              </Button>
            </Form>
          )}
        </Container>
      );
      
};

export default TruckInfo;

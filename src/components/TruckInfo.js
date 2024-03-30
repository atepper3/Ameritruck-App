import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { db } from '../firebase';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { Button, Form } from 'react-bootstrap';

const TruckInfo = () => {
    const { id } = useParams();
    const [truck, setTruck] = useState({});
    const [editable, setEditable] = useState(false);

    useEffect(() => {
        const fetchTruckInfo = async () => {
            const truckRef = doc(db, 'trucks', id);
            const truckSnap = await getDoc(truckRef);
            if (truckSnap.exists() && truckSnap.data().truckinfo) {
                // Directly set truck information without conversion
                setTruck(truckSnap.data().truckinfo);
            } else {
                console.log("No truck information found!");
            }
        };
    
        fetchTruckInfo();
    }, [id]);
    

    const handleChange = (e) => {
        const { name, value } = e.target;
        setTruck(prev => ({
            ...prev,
            [name]: value,
        }));
    };
    

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const truckRef = doc(db, 'trucks', id);
            await updateDoc(truckRef, { truckinfo: truck });
            alert('Truck information updated successfully!');
            setEditable(false);
        } catch (error) {
            console.error('Error updating truck: ', error);
            alert('Failed to update truck.');
        }
    };

    return (
        <div>
            <Button onClick={() => setEditable(!editable)} variant="primary" size="sm">
                {editable ? 'Cancel' : 'Edit'}
            </Button>
            <Form onSubmit={handleSubmit} className="mt-3">
                <fieldset disabled={!editable}>
                    <div className="row">
                        {[
                            { label: "Stock Number", value: truck.stockNumber, name: "stockNumber" },
                            { label: "Fleet Number", value: truck.fleetNumber, name: "fleetNumber" },
                            { label: "Status", value: truck.status, name: "status", isSelect: true, options: ["Active", "Future", "Pending", "Sold"] },
                            { label: "Sale Type", value: truck.saleType, name: "saleType" },
                            { label: "Purchase Date", value: truck.purchaseDate, name: "purchaseDate", type: "date" },
                            { label: "Purchased From", value: truck.purchasedFrom, name: "purchasedFrom" },
                            { label: "Purchase Price", value: truck.purchasePrice, name: "purchasePrice", type: "number" },
                            { label: "Buyer", value: truck.buyer, name: "buyer" },
                            { label: "Year", value: truck.year, name: "year" },
                            { label: "Make", value: truck.make, name: "make" },
                            { label: "Model", value: truck.model, name: "model" },
                            { label: "VIN/Serial", value: truck.vinSerial, name: "vinSerial" },
                            { label: "Classification", value: truck.classification, name: "classification" },
                            { label: "Location", value: truck.location, name: "location" },
                            { label: "Truck Here?", value: truck.truckHere, name: "truckHere", isSelect: true, options: ["Yes", "No"] },
                            { label: "Title In", value: truck.titleIn, name: "titleIn", isSelect: true, options: ["Yes", "No"] },
                            { label: "Title In Note", value: truck.titleInNote, name: "titleInNote" },
                            { label: "Close Type", value: truck.closeType, name: "closeType" },
                            { label: "Customer", value: truck.customer, name: "customer" },
                            { label: "Sale Date", value: truck.saleDate, name: "saleDate", type: "date" },
                            { label: "Sold Price", value: truck.soldPrice, name: "soldPrice", type: "number" },
                            { label: "Salesman", value: truck.salesman, name: "salesman" },
                            { label: "Funded Date", value: truck.fundedDate, name: "fundedDate", type: "date" },
                            { label: "Funding Type", value: truck.fundingType, name: "fundingType" },
                            { label: "Referral Source", value: truck.referralSource, name: "referralSource" },
                            { label: "Title Out", value: truck.titleOut, name: "titleOut", isSelect: true, options: ["Yes", "No"] },
                            { label: "Title Out Note", value: truck.titleOutNote, name: "titleOutNote" },
                            { label: "Comments", value: truck.comments, name: "comments", isTextarea: true },
                        ].map(({ label, value, name, type = "text", isSelect = false, options = [], isTextarea = false }) =>
                            <div className="col-md-3" key={name}>
                                <Form.Group>
                                    <Form.Label>{label}</Form.Label>
                                    {!isSelect && !isTextarea && (
                                        <Form.Control
                                            type={type}
                                            name={name}
                                            value={value || ''}
                                            onChange={handleChange}
                                            as={isTextarea ? "textarea" : "input"}
                                        />
                                    )}
                                    {isSelect && (
                                        <Form.Control
                                            as="select"
                                            name={name}
                                            value={value || ''}
                                            onChange={handleChange}>
                                            {options.map(option => (
                                                <option key={option} value={option}>{option}</option>
                                            ))}
                                        </Form.Control>
                                    )}
                                    {isTextarea && (
                                        <Form.Control
                                            as="textarea"
                                            name={name}
                                            value={value || ''}
                                            onChange={handleChange}
                                        />
                                    )}
                                </Form.Group>
                            </div>
                        )}
                    </div>
                    <Button type="submit" className="btn btn-primary mt-3">
                        Save Changes
                    </Button>
                </fieldset>
            </Form>
        </div>
    );
};

export default TruckInfo;

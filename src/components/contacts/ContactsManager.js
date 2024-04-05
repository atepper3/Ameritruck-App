import React, { useState, useEffect } from 'react';
import { db } from '../../firebase';
import { collection, addDoc, getDocs } from 'firebase/firestore';
import { Container, Card, Button, Form, Row, Col, Table, Modal } from 'react-bootstrap';

const ContactsManager = () => {
    const [contacts, setContacts] = useState([]);
    const [newContact, setNewContact] = useState({
        name: '',
        companyName: '',
        address: '',
        phoneNumber: '',
        email: ''
    });
    const [showAddContactModal, setShowAddContactModal] = useState(false);
    const [showContactDetailModal, setShowContactDetailModal] = useState(false);
    const [selectedContact, setSelectedContact] = useState(null);
    const [searchTerm, setSearchTerm] = useState("");

    const fetchContacts = async () => {
        const querySnapshot = await getDocs(collection(db, "contacts"));
        const contactsArray = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setContacts(contactsArray);
    };

    useEffect(() => {
        fetchContacts();
    }, []);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setNewContact(prevState => ({
            ...prevState,
            [name]: value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await addDoc(collection(db, "contacts"), newContact);
            alert("Contact added successfully!");
            setNewContact({
                name: '',
                companyName: '',
                address: '',
                phoneNumber: '',
                email: ''
            });
            fetchContacts();
            setShowAddContactModal(false);
        } catch (error) {
            console.error("Error adding contact: ", error);
            alert("Failed to add contact.");
        }
    };

    const handleContactClick = (contact) => {
        setSelectedContact(contact);
        setShowContactDetailModal(true);
    };

    // Filter contacts based on search term
    const filteredContacts = contacts.filter(contact =>
        contact.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        contact.companyName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        contact.email.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <Container>
            <Card className="shadow mt-4 bg-dark text-white">
                <Card.Header>
                    <Row>
                        <Col>
                            <h3>Manage Contacts</h3>
                        </Col>
                        <Col className="text-right">
                            <Button variant="secondary" onClick={() => setShowAddContactModal(true)}>Add New Contact</Button>
                        </Col>
                    </Row>
                    <Row className="mt-3">
                        <Col>
                            <Form.Control
                                type="text"
                                placeholder="Search contacts..."
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </Col>
                    </Row>
                </Card.Header>
                <Card.Body>
                    <Table striped bordered hover variant="dark" className="mt-4">
                        <thead>
                            <tr>
                                <th>Name</th>
                                <th>Company Name</th>
                                <th>Address</th>
                                <th>Phone Number</th>
                                <th>Email</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredContacts.map((contact) => (
                                <tr key={contact.id} onClick={() => handleContactClick(contact)}>
                                    <td>{contact.name}</td>
                                    <td>{contact.companyName}</td>
                                    <td>{contact.address}</td>
                                    <td>{contact.phoneNumber}</td>
                                    <td>{contact.email}</td>
                                </tr>
                            ))}
                        </tbody>
                    </Table>
                    </Card.Body>
            </Card>

            {/* Add New Contact Modal */}
            <Modal show={showAddContactModal} onHide={() => setShowAddContactModal(false)} className="dark-modal">
                <Modal.Header closeButton className="bg-dark text-white">
                    <Modal.Title>Add New Contact</Modal.Title>
                </Modal.Header>
                <Modal.Body className="bg-dark text-white">
                    <Form onSubmit={handleSubmit}>
                        <Form.Group className="mb-3" controlId="formGroupName">
                            <Form.Label>Name</Form.Label>
                            <Form.Control type="text" placeholder="Enter name" name="name" value={newContact.name} onChange={handleChange} />
                        </Form.Group>
                        <Form.Group className="mb-3" controlId="formGroupCompanyName">
                            <Form.Label>Company Name</Form.Label>
                            <Form.Control type="text" placeholder="Enter company name" name="companyName" value={newContact.companyName} onChange={handleChange} />
                        </Form.Group>
                        <Form.Group className="mb-3" controlId="formGroupAddress">
                            <Form.Label>Address</Form.Label>
                            <Form.Control type="text" placeholder="Enter address" name="address" value={newContact.address} onChange={handleChange} />
                        </Form.Group>
                        <Form.Group className="mb-3" controlId="formGroupPhoneNumber">
                            <Form.Label>Phone Number</Form.Label>
                            <Form.Control type="text" placeholder="Enter phone number" name="phoneNumber" value={newContact.phoneNumber} onChange={handleChange} />
                        </Form.Group>
                        <Form.Group className="mb-3" controlId="formGroupEmail">
                            <Form.Label>Email Address</Form.Label>
                            <Form.Control type="email" placeholder="Enter email" name="email" value={newContact.email} onChange={handleChange} />
                        </Form.Group>
                        <div className="text-end">
                            <Button variant="secondary" onClick={() => setShowAddContactModal(false)} className="me-2">Cancel</Button>
                            <Button variant="primary" type="submit">Save Contact</Button>
                        </div>
                    </Form>
                </Modal.Body>
            </Modal>

            {/* Contact Detail Modal */}
            <Modal show={showContactDetailModal} onHide={() => setShowContactDetailModal(false)} className="dark-modal">
                <Modal.Header closeButton className="bg-dark text-white">
                    <Modal.Title>Contact Details</Modal.Title>
                </Modal.Header>
                <Modal.Body className="bg-dark text-white">
                    {selectedContact && (
                        <div>
                            <p><strong>Name:</strong> {selectedContact.name}</p>
                            <p><strong>Company Name:</strong> {selectedContact.companyName}</p>
                            <p><strong>Address:</strong> {selectedContact.address}</p>
                            <p><strong>Phone Number:</strong> {selectedContact.phoneNumber}</p>
                            <p><strong>Email:</strong> {selectedContact.email}</p>
                        </div>
                    )}
                </Modal.Body>
            </Modal>
        </Container>
    );
};

export default ContactsManager;

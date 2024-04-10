import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { truckFormFields } from "./truckFormFields"; // Ensure correct import path
import { addMultipleTrucks } from "../../store/slices/truckSlice";
import { Button, Form, Container, Row, Col } from "react-bootstrap";

const AddMultipleTrucksForm = () => {
  const [truckEntries, setTruckEntries] = useState(
    Array(5)
      .fill(null)
      .map(() => ({}))
  );
  const dispatch = useDispatch();

  const handleAddTruck = () => {
    setTruckEntries([...truckEntries, {}]);
  };

  const handleChange = (entryIndex, key, value) => {
    const updatedEntries = [...truckEntries];
    updatedEntries[entryIndex] = {
      ...updatedEntries[entryIndex],
      [key]: value,
    };
    setTruckEntries(updatedEntries);
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    dispatch(addMultipleTrucks(truckEntries));
    setTruckEntries(
      Array(5)
        .fill(null)
        .map(() => ({}))
    ); // Reset the form
  };

  // Define the fields to include in this form
  const relevantFields = [
    "stockNumber",
    "fleetNumber",
    "status",
    "saleType",
    "purchaseDate",
    "purchasedFrom",
    "purchasePrice",
    "buyer",
    "year",
    "make",
    "model",
    "vinSerial",
    "classification",
    "location",
    "truckHere",
  ];

  // Filter the fields based on relevance
  const filteredFields = truckFormFields
    .flat()
    .filter((field) => relevantFields.includes(field.name));

  return (
    <Container>
      <Form onSubmit={handleSubmit}>
        <h3>Add Multiple Trucks</h3>
        {filteredFields.map((field, index) => (
          <Row key={index} className="mb-3 align-items-center">
            <Col xs={3}>
              <Form.Label>{field.label}</Form.Label>
            </Col>
            {Array.from({ length: 5 }).map((_, entryIndex) => (
              <Col key={entryIndex}>
                {field.type === "select" ? (
                  <Form.Select
                    value={truckEntries[entryIndex]?.[field.name] || ""}
                    onChange={(e) =>
                      handleChange(entryIndex, field.name, e.target.value)
                    }
                  >
                    <option value="">Select...</option>
                    {field.options.map((option) => (
                      <option key={option} value={option}>
                        {option}
                      </option>
                    ))}
                  </Form.Select>
                ) : (
                  <Form.Control
                    type={field.type}
                    value={truckEntries[entryIndex]?.[field.name] || ""}
                    onChange={(e) =>
                      handleChange(entryIndex, field.name, e.target.value)
                    }
                  />
                )}
              </Col>
            ))}
          </Row>
        ))}
        <Row className="mt-3">
          <Col>
            <Button variant="primary" onClick={handleAddTruck} className="me-2">
              Add Another Truck
            </Button>
            <Button type="submit">Submit All Trucks</Button>
          </Col>
        </Row>
      </Form>
    </Container>
  );
};

export default AddMultipleTrucksForm;

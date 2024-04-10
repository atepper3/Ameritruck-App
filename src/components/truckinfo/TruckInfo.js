import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchTruckDetails,
  updateTruckDetails,
} from "../../store/slices/truckSlice";
import { Form, Button, Container, Card, Row, Col } from "react-bootstrap";
import { fieldGroups } from "./FieldGroups";
import "./TruckInfo.css";

const TruckInfo = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  // Accessing the truck details from the Redux store
  const truck = useSelector((state) => state.truck.truckInfo);
  const [loading, setLoading] = useState(true); // Initially, the loading state is true
  const [formState, setFormState] = useState({});

  useEffect(() => {
    if (!truck) {
      dispatch(fetchTruckDetails(id))
        .then(() => setLoading(false))
        .catch((error) => {
          console.error("Failed to fetch truck details:", error);
          setLoading(false);
        });
    } else {
      setLoading(false);
      setFormState(truck);
    }
  }, [id, dispatch, truck]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormState((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    dispatch(updateTruckDetails(id, formState));
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <Container fluid className="mt-2">
      <Form onSubmit={handleSubmit} className="text-small">
        {/* First Row: Truck Identification and Purchase */}
        <Row xs={1} md={2} className="g-2 mb-2">
          {fieldGroups.slice(0, 2).map((group, index) => (
            <Col key={index}>
              <Card className="truck-info-card h-100">
                <Card.Header as="h6" className="truck-info-card-header small">
                  {group.title}
                </Card.Header>
                <Card.Body className="truck-info-card-body p-2">
                  {group.fields.map((field, idx) => (
                    <Form.Group as={Row} className="mb-1" key={idx}>
                      <Form.Label column xs="5" className="small">
                        {field.label}:
                      </Form.Label>
                      <Col xs="7">
                        {field.type === "select" ? (
                          <Form.Select
                            size="sm"
                            name={field.name}
                            value={truck[field.name] || ""}
                            onChange={handleChange}
                            className="small"
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
                            size="sm"
                            type={
                              field.type === "textarea" ? undefined : field.type
                            }
                            as={
                              field.type === "textarea" ? "textarea" : undefined
                            }
                            name={field.name}
                            value={formState[field.name] || ""}
                            onChange={handleChange}
                            rows={field.type === "textarea" ? 2 : undefined}
                            className="small"
                          />
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
              <Card className="truck-info-card">
                <Card.Header as="h6" className="truck-info-card-header small">
                  {group.title}
                </Card.Header>
                <Card.Body className="truck-info-card-body p-2">
                  {group.fields.map((field, idx) => (
                    <Form.Group as={Row} className="mb-1" key={idx}>
                      <Form.Label column xs="5" className="small">
                        {field.label}:
                      </Form.Label>
                      <Col xs="7">
                        {field.type === "select" ? (
                          <Form.Select
                            size="sm"
                            name={field.name}
                            value={truck[field.name] || ""}
                            onChange={handleChange}
                            className="small"
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
                            size="sm"
                            type={
                              field.type === "textarea" ? undefined : field.type
                            }
                            as={
                              field.type === "textarea" ? "textarea" : undefined
                            }
                            name={field.name}
                            value={truck[field.name] || ""}
                            onChange={handleChange}
                            rows={field.type === "textarea" ? 2 : undefined}
                            className="small"
                          />
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
          <Button type="submit" variant="success" size="sm" className="mt-2">
            Save Changes
          </Button>
        </div>
      </Form>
    </Container>
  );
};

export default TruckInfo;

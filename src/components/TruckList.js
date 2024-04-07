import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { fetchTruckList } from "../store/actions/truckActions";
import { Card, CardHeader, CardBody, Row, Col } from "reactstrap";

const TruckList = () => {
  const dispatch = useDispatch();
  const trucks = useSelector((state) => state.truck.truckList);

  useEffect(() => {
    dispatch(fetchTruckList());
  }, [dispatch]);

  const formatDate = (dateStr) => new Date(dateStr).toLocaleDateString();
  const formatVIN = (vin) => (vin ? vin.slice(-6) : "");
  const formatPrice = (price) =>
    price ? `$${parseFloat(price).toFixed(2)}` : "";

  return (
    <div className="container-fluid">
      <Row className="justify-content-center">
        <Col lg="12">
          <Card className="shadow">
            <CardHeader className="bg-transparent">
              <div className="text-center">
                <h2 className="mb-0">Ameritruck Inventory</h2>
              </div>
            </CardHeader>
            <CardBody>
              <div className="table-responsive">
                <table className="table table-dark">
                  <thead>
                    <tr>
                      <th>Stock Number</th>
                      <th>Fleet Number</th>
                      <th>Status</th>
                      <th>Sale Type</th>
                      <th>Year</th>
                      <th>Model</th>
                      <th>VIN</th>
                      <th>Purchase Date</th>
                      <th>Purchase Price</th>
                      <th>Customer</th>
                      <th>Sale Date</th>
                      <th>Sold Price</th>
                      <th>Funded Date</th>
                      <th>Title In?</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {trucks.map((truck) => (
                      <tr key={truck.id}>
                        <td>{truck.stockNumber}</td>
                        <td>{truck.fleetNumber}</td>
                        <td>{truck.status}</td>
                        <td>{truck.saleType}</td>
                        <td>{truck.year}</td>
                        <td>{truck.model}</td>
                        <td>{truck.vinSerial}</td>
                        <td>{truck.purchaseDate}</td>
                        <td>{truck.purchasePrice}</td>
                        <td>{truck.customer}</td>
                        <td>{truck.saleDate}</td>
                        <td>{truck.soldPrice}</td>
                        <td>{truck.fundedDate}</td>
                        <td>{truck.titleIn}</td>
                        <td>
                          <Link
                            to={`/truck/${truck.id}/info`}
                            className="btn btn-custom btn-sm"
                          >
                            More Details
                          </Link>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardBody>
          </Card>
        </Col>
      </Row>
    </div>
  );
};
export default TruckList;

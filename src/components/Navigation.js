import React from 'react';
import { Navbar, Nav, NavDropdown } from 'react-bootstrap';
import { useSelector } from 'react-redux';

const Navigation = () => {
  const truckDetails = useSelector(state => state.truck.truckInfo);

  return (
    <Navbar variant="dark" expand="lg" className="custom-navbar py-1">
      {/* Added ml-4 (margin-left) to shift Ameritruck to the right */}
      <Navbar.Brand href="/" className="navbar-brand" style={{ marginLeft: '1rem' }}>
        Ameritruck
      </Navbar.Brand>
      <Navbar.Toggle aria-controls="basic-navbar-nav" />
      <Navbar.Collapse id="basic-navbar-nav" className="justify-content-between">
        <Nav className="me-auto">
          <NavDropdown title="Trucks" id="nav-dropdown-trucks">
            <NavDropdown.Item href="/truck-list">Truck List</NavDropdown.Item>
            <NavDropdown.Item href="/add-truck">Add Truck</NavDropdown.Item>
            <NavDropdown.Item href="/add-multiple-trucks">Add Multiple Trucks</NavDropdown.Item>
          </NavDropdown>
          <NavDropdown title="Contacts" id="nav-dropdown-contacts">
            <NavDropdown.Item href="/contacts">Manage Contacts</NavDropdown.Item>
          </NavDropdown>
        </Nav>
{truckDetails && (
      <div className="ms-auto d-flex align-items-center" style={{ position: 'absolute', left: '50%', transform: 'translateX(-50%)' }}>
        <span className="text-white mr-3">
          {`Stock #${truckDetails.stockNumber || ''} - ${truckDetails.year || ''} ${truckDetails.make || ''} ${truckDetails.model || ''}`}
        </span>
        <Nav className="ml-auto">
          <Nav.Link href={`/truck/${truckDetails.id}/info`}>Detailed Info</Nav.Link>
          <Nav.Link href={`/truck/${truckDetails.id}/expenses`}>Expenses</Nav.Link>
          <Nav.Link href={`/truck/${truckDetails.id}/commissions`}>Commissions</Nav.Link>
        </Nav>          </div>
        )}
      </Navbar.Collapse>
    </Navbar>
  );
};

export default Navigation;

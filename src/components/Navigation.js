import React from 'react';
import { Navbar, Nav, NavDropdown } from 'react-bootstrap';

const Navigation = () => {
  return (
    <Navbar variant="dark" expand="lg" className="custom-navbar py-1" style={{ paddingLeft: '1rem' }}> {/* Adjust padding to move brand name */}
      <Navbar.Brand className="navbar-brand" style={{ pointerEvents: 'none', cursor: 'default' }}>
        Ameritruck
      </Navbar.Brand>
      <Navbar.Toggle aria-controls="basic-navbar-nav" />
      <Navbar.Collapse id="basic-navbar-nav">
        <Nav className="mr-auto">
          <NavDropdown title="Trucks" id="nav-dropdown-trucks" className="text-white">
            <NavDropdown.Item href="/truck-list">Truck List</NavDropdown.Item>
            <NavDropdown.Item href="/add-truck">Add Truck</NavDropdown.Item>
            <NavDropdown.Item href="/add-multiple-trucks">Add Multiple Trucks</NavDropdown.Item>
          </NavDropdown>
          <NavDropdown title="Contacts" id="nav-dropdown-contacts" className="text-white">
            <NavDropdown.Item href="/contacts">Manage Contacts</NavDropdown.Item>
          </NavDropdown>
        </Nav>
      </Navbar.Collapse>
    </Navbar>
  );
};

export default Navigation;

// src/App.js
import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import './custom-styles.css';
import TruckList from './components/TruckList'; // Make sure to import TruckList
import TruckDetails from './components/TruckDetails';
import TruckForm from './components/TruckForm';
import AddMultipleTrucksForm from './components/AddMultipleTrucksForm';

function App() {
  return (
    <Router>
      <div className="container mt-3">
        <nav className="navbar navbar-expand-lg navbar-light bg-light">
          <div className="container-fluid">
            <Link className="navbar-brand" to="/">Dashboard</Link>
            <div className="navbar-nav">
              <Link className="nav-link" to="/add-truck">Add Truck</Link>
              <Link className="nav-link" to="/add-multiple-trucks">Add Multiple Trucks</Link>
            </div>
          </div>
        </nav>
        <Routes>
          <Route path="/" element={<TruckList />} /> {/* Add this line for TruckList */}
          <Route path="/add-truck" element={<TruckForm />} />
          <Route path="/truck/:id" element={<TruckDetails />} />
          <Route path="/add-multiple-trucks" element={<AddMultipleTrucksForm />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;

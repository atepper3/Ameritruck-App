// src/App.js
import React, { useRef } from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import './custom-styles.css';
import Dashboard from './components/Dashboard';
import TruckDetails from './components/TruckDetails';
import TruckForm from './components/TruckForm';
import AddMultipleTrucksForm from './components/AddMultipleTrucksForm';
import * as XLSX from 'xlsx';



function App() {
  const fileInputRef = useRef(null);

  const handleExcelUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Excel file processing logic here
    // For example:
    const reader = new FileReader();
    reader.onload = (event) => {
      // Process Excel file
      console.log('Excel file processed');
    };
    reader.readAsArrayBuffer(file);
  };

  const handleUploadClick = () => {
    fileInputRef.current.click();
  };

  return (
    <Router>
      <div className="container mt-3">
        <nav className="navbar navbar-expand-lg navbar-light bg-light">
          <div className="container-fluid">
            <Link className="navbar-brand" to="/">Dashboard</Link>
            <div className="navbar-nav">
              <Link className="nav-link" to="/add-truck">Add Truck</Link>
              <Link className="nav-link" to="/add-multiple-trucks">Add Multiple Trucks</Link>
              <a className="nav-link" href="#" onClick={handleUploadClick}>Excel Upload</a>
              <input type="file" ref={fileInputRef} onChange={handleExcelUpload} style={{ display: 'none' }} accept=".xlsx, .xls" />
            </div>
          </div>
        </nav>
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/add-truck" element={<TruckForm />} />
          <Route path="/truck/:id" element={<TruckDetails />} />
          <Route path="/add-multiple-trucks" element={<AddMultipleTrucksForm />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;

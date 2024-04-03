// src/App.js
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import './styles/Custom-styles.css';
import { TruckProvider } from './TruckContext'; // Import the context provider
import Navigation from './components/Navigation'; // Import the Navigation component
import TruckList from './components/TruckList';
import TruckDetails from './components/TruckDetails';
import TruckForm from './components/TruckForm';
import AddMultipleTrucksForm from './components/AddMultipleTrucksForm';
import ContactsManager from './components/ContactsManager';

function App() {
  return (
    <TruckProvider> {/* Wrap your application within the TruckProvider */}
      <Router>
        <Navigation /> {/* Navigation is now within the TruckProvider scope */}
        <Routes>
          <Route path="/truck-list" element={<div className="container-fluid mt-3"><TruckList /></div>} />
          <Route path="/add-truck" element={<div className="container mt-3"><TruckForm /></div>} />
          <Route path="/truck/:id" element={<div className="container mt-3"><TruckDetails /></div>} />
          <Route path="/add-multiple-trucks" element={<div className="container mt-3"><AddMultipleTrucksForm /></div>} />
          <Route path="/contacts" element={<ContactsManager />} />
        </Routes>
      </Router>
    </TruckProvider>
  );
}

export default App;

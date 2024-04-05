// src/App.js
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import './styles/Custom-styles.css';
import TruckList from './components/TruckList';
import TruckInfo from './components/truckinfo/TruckInfo';
import TruckForm from './components/addtrucks/TruckForm';
import AddMultipleTrucksForm from './components/addtrucks/AddMultipleTrucksForm';
import ContactsManager from './components/contacts/ContactsManager';
import ExpenseList from './components/expenses/ExpenseList';
import CommissionList from './components/commissions/CommissionList';
import { Provider } from 'react-redux';
import store from './store';
import Navigation from './components/Navigation'; 

function App() {
  return (
    <Provider store={store}>
      <Router>
        <Navigation /> {/* Navigation is now within the TruckProvider scope */}
        <Routes>
          <Route path="/truck-list" element={<div className="container-fluid mt-3"><TruckList /></div>} />
          <Route path="/add-truck" element={<div className="container mt-3"><TruckForm /></div>} />
          <Route path="/truck/:id/info" element={<div className="container mt-3"><TruckInfo /></div>} />
          <Route path="/truck/:id/expenses" element={<div className="container mt-3"><ExpenseList /></div>} />
          <Route path="/truck/:id/commissions" element={<div className="container mt-3"><CommissionList /></div>} />
          <Route path="/add-multiple-trucks" element={<div className="container mt-3"><AddMultipleTrucksForm /></div>} />
          <Route path="/contacts" element={<ContactsManager />} />
        </Routes>
      </Router>
    </Provider>
  );
}

export default App;

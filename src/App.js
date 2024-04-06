import React from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import TruckList from './components/TruckList';
import TruckInfo from './components/truckinfo/TruckInfo';
import TruckForm from './components/addtrucks/TruckForm';
import AddMultipleTrucksForm from './components/addtrucks/AddMultipleTrucksForm';
import ContactsManager from './components/contacts/ContactsManager';
import ExpenseList from './components/expenses/ExpenseList';
import CommissionList from './components/commissions/CommissionList';
import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react'; // Import PersistGate
import { store, persistor } from './store'; // Make sure this path is correct
import Navigation from './components/navigation/Navigation';
import SecondaryNavbar from './components/navigation/SecondaryNavbar';

function ConditionalSecondaryNavbar() {
  const location = useLocation();
  const paths = ['/truck/:id/info', '/truck/:id/expenses', '/truck/:id/commissions'];
  const shouldShowSecondaryNavbar = paths.some(path =>
    new RegExp(path.replace(':id', '[^/]+')).test(location.pathname));

  return shouldShowSecondaryNavbar ? <SecondaryNavbar /> : null;
}

function App() {
  return (
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <Router>
          <Navigation />
          <ConditionalSecondaryNavbar />
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
      </PersistGate>
    </Provider>
  );
}

export default App;
